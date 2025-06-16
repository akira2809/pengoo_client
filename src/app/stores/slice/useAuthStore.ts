import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Định nghĩa interface User để đảm bảo kiểu dữ liệu nhất quán
interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  avatar_url: string;
  address: string;
  role: string;
}

// Định nghĩa AuthState chứa tất cả các trạng thái và hàm liên quan đến xác thực
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    username: string;
    password: string;
    full_name: string;
    email: string;
    phone_number: string;
    avatar_url?: string;
    address?: string;
    role?: string;
  }) => Promise<{ success: boolean; message: string }>;
  verifyToken: (token: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  updateUser: (userData: Partial<User> & { id: string }) => Promise<{ success: boolean; message: string; user?: User }>;
  clearError: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        console.log('Login attempt with credentials:', credentials);
        set({ isLoading: true, error: null });
        try {
          // Bước 1: Gọi API đăng nhập để lấy access_token
          const signInResponse = await fetch('http://localhost:3000/api/auth/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
          });

          const signInData = await signInResponse.json();
          console.log('Sign in response:', signInData);

          // Kiểm tra xem access_token có tồn tại không
          if (!signInData.access_token) {
            console.error('No token in response:', signInData);
            throw new Error('No authentication token received from server');
          }

          // Bước 2: Sử dụng access_token để xác thực và lấy thông tin người dùng
          const verifyResponse = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: signInData.access_token // Gửi access_token để xác minh
            }),
          });

          const verifyData = await verifyResponse.json();

          if (!verifyResponse.ok) {
            throw new Error(verifyData.message || 'Token verification failed after sign-in');
          }

          // Cập nhật trạng thái của store sau khi đăng nhập thành công
          const authState = {
            user: verifyData.user || null,
            token: signInData.access_token, // Lưu access_token vào store
            isAuthenticated: true,
            isLoading: false,
            error: null,
          };

          set(authState);

          return { success: true, message: 'Login successful' };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
          console.error('Login error:', error);
          set({ error: errorMessage, isLoading: false });
          return { success: false, message: errorMessage };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...userData,
              role: userData.role || 'user',
              avatar_url: userData.avatar_url || '',
              address: userData.address || '',
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, message: 'Registration successful' };
        } catch (error: unknown) {
          console.error('Error in register:', error);
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, message: errorMessage };
        }
      },

      clearError: () => set({ error: null }),
      
      updateUser: async (userData) => {
        const { token } = get();
        if (!token) {
          return { success: false, message: 'Chưa đăng nhập' };
        }

        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch('http://localhost:3000/api/users/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Cập nhật thất bại');
          }

          // Cập nhật thông tin user trong store
          set(state => ({
            user: { ...state.user, ...userData } as User,
            isLoading: false
          }));

          return { 
            success: true, 
            message: 'Cập nhật thông tin thành công',
            user: { ...get().user, ...userData } as User
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Lỗi khi cập nhật thông tin';
          set({ error: errorMessage, isLoading: false });
          return { success: false, message: errorMessage };
        }
      },
      

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Hàm verifyToken được cải thiện
      verifyToken: async (token: string) => {
        try {
          const response = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          let data: any;
          try {
            data = await response.json();
            console.log('Verify Token API Response Data:', data);
          } catch (jsonError) {
            console.error('Error parsing JSON response from /api/auth/verify:', jsonError);
            console.error('Raw response status:', response.status);
            return { 
              success: false, 
              message: `Lỗi xử lý phản hồi từ máy chủ (Mã lỗi: ${response.status})` 
            };
          }

          // Kiểm tra nếu API trả về isValid thay vì user
          if (data.isValid && data.decoded) {
            const userData = {
              id: data.decoded.sub || data.decoded.userId || '',
              username: data.decoded.username || data.decoded.email || '',
              email: data.decoded.email || '',
              full_name: data.decoded.full_name || data.decoded.name || '',
              phone_number: data.decoded.phone_number || data.decoded.phone || '',
              avatar_url: data.decoded.avatar_url || data.decoded.picture || '',
              address: data.decoded.address || '',
              role: data.decoded.role || 'user'
            };

            // Cập nhật trạng thái store
            set({
              user: userData,
              isAuthenticated: true,
              token: token,
              isLoading: false,
              error: null,
            });

            return { 
              success: true, 
              user: userData 
            };
          }

          // Nếu không phải định dạng mong đợi
          return { 
            success: false, 
            message: data.message || 'Định dạng dữ liệu không hợp lệ từ máy chủ' 
          };
        } catch (error: unknown) {
          // Bắt các lỗi mạng hoặc lỗi xảy ra trước khi có phản hồi JSON
          let errorMessage = 'An unexpected network error occurred during token verification.';
          if (error instanceof Error) {
            errorMessage = error.message || 'Unknown network error occurred.';
          } else if (typeof error === 'string') {
            errorMessage = error;
          }

          console.error('Error in verifyToken outer catch block (useAuthStore):', error);
          return {
            success: false,
            message: errorMessage
          };
        }
      }
    }),
    {
      name: 'auth-storage', // Tên cho localStorage
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify({
            state: {
              ...value.state,
              user: value.state.user,
              token: value.state.token,
              isAuthenticated: value.state.isAuthenticated,
            },
            version: value.version,
          }));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      // Chỉ lưu các trường cần thiết vào localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);