// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Điều chỉnh đường dẫn theo cấu trúc thư mục của bạn
import { authService } from '../../api/services/authService';

// Định nghĩa interface User để đảm bảo kiểu dữ liệu nhất quán
// Export để có thể tái sử dụng ở các component
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  avatar_url: string;
  address: string;
  role: string;
  points?: number;
  mfaCode?: number | null;
  provider?: string;
}

// Định nghĩa AuthState chứa tất cả các trạng thái và hàm liên quan đến xác thực
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginMethod: 'email' | 'google' | null;
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
    points?: number;
  }) => Promise<{ success: boolean; message: string }>;
  verifyToken: (token: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  updateUser: (userData: Partial<User> & { id: string }) => Promise<{ success: boolean; message: string; user?: User }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
  logout: () => void;
  verifyVoucherByUserPoint: (voucherCode: string) => Promise<{ success: boolean; message?: string }>;
  setLoginMethod: (method: 'email' | 'google' | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      loginMethod: null,

      /**
       * Xử lý quá trình đăng nhập người dùng.
       * Bao gồm gọi API đăng nhập và xác minh token để lấy thông tin người dùng.
       */
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const signInData = await authService.signIn(credentials);
          console.log('Sign in response from service:', signInData);

          const verifyData = await authService.verifyToken(signInData.access_token!); // Dùng ! vì đã kiểm tra presence trong service
          console.log('Verify token response from service:', verifyData);

          if (!verifyData.isValid || !verifyData.decoded) {
            throw new Error(verifyData.message || 'Xác thực token thất bại sau đăng nhập.');
          }

          // Chuyển đổi dữ liệu decoded từ service thành kiểu User của store
          const decodedUser: User = {
            id: verifyData.decoded.sub || verifyData.decoded.userId || '',
            username: verifyData.decoded.username || verifyData.decoded.email || '',
            email: verifyData.decoded.email || '',
            full_name: verifyData.decoded.full_name || verifyData.decoded.name || '',
            phone_number: verifyData.decoded.phone_number || verifyData.decoded.phone || '',
            avatar_url: verifyData.decoded.avatar_url || verifyData.decoded.picture || '',
            address: verifyData.decoded.address || '',
            role: verifyData.decoded.role || 'user',
            points: verifyData.decoded.points || 0,
            mfaCode: verifyData.mfaCode || null,
            provider: verifyData.decoded.provider || '',
          };

          set({
            user: decodedUser,
            token: signInData.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            loginMethod: 'email',
          });

          return { success: true, message: 'Đăng nhập thành công.' };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định khi đăng nhập.';
          console.error('Lỗi đăng nhập:', error);
          // Đảm bảo xóa trạng thái xác thực khi đăng nhập thất bại
          set({ error: errorMessage, isLoading: false, user: null, token: null, isAuthenticated: false });
          return { success: false, message: errorMessage };
        }
      },

      /**
       * Xử lý quá trình đăng ký người dùng mới.
       * Sau khi đăng ký thành công, sẽ tự động thử đăng nhập.
       */
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.register(userData); // Gọi qua authService

          console.log("Register API raw response:", data);

          // Nếu backend trả về thông tin người dùng (ví dụ: data.id) hoặc không ném lỗi
          // thì chúng ta coi là đăng ký thành công.
          if (data.id || data.message) { // Kiểm tra nếu có id hoặc message thành công
            console.log('Registration successful. Response:', data);

            // Tự động đăng nhập người dùng sau khi đăng ký thành công
            const loginResult = await get().login({
              email: userData.email,
              password: userData.password,
            });

            if (loginResult.success) {
              return { success: true, message: 'Đăng ký và đăng nhập thành công.' };
            } else {
              // Đăng ký thành công nhưng đăng nhập tự động thất bại
              return { success: false, message: `Đăng ký thành công nhưng không thể tự động đăng nhập: ${loginResult.message}` };
            }
          } else {
            // Nếu không có 'id' hoặc 'message' và không có lỗi từ authService.register
            throw new Error('Đăng ký thành công nhưng phản hồi từ máy chủ không rõ ràng.');
          }

        } catch (error: unknown) {
          console.error('Lỗi khi đăng ký:', error);
          const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại.';
          // Đảm bảo xóa trạng thái xác thực khi đăng ký thất bại
          set({ error: errorMessage, isLoading: false, user: null, token: null, isAuthenticated: false });
          return { success: false, message: errorMessage };
        }
      },

      /**
       * Gửi yêu cầu đặt lại mật khẩu qua email.
       */
      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.forgotPassword(email);
          return { success: true, message: data.message || 'Yêu cầu đã được gửi thành công.' };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi yêu cầu đặt lại mật khẩu.';
          set({ error: errorMessage });
          return { success: false, message: errorMessage };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Thực hiện đặt lại mật khẩu bằng token và mật khẩu mới.
       */
      resetPassword: async (token: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.resetPassword(token, newPassword);
          return { success: true, message: data.message || 'Mật khẩu đã được đặt lại thành công.' };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi đặt lại mật khẩu.';
          set({ error: errorMessage });
          return { success: false, message: errorMessage };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Cập nhật thông tin người dùng.
       * Yêu cầu người dùng phải đang đăng nhập.
       */
      updateUser: async (userDataToUpdate) => {
        const { token, user } = get();
        if (!token) {
          return { success: false, message: 'Người dùng chưa đăng nhập.' };
        }
        if (!user || !user.id) { // Đảm bảo có user và id để cập nhật
          return { success: false, message: 'Không tìm thấy thông tin người dùng để cập nhật.' };
        }

        set({ isLoading: true, error: null });
        try {
          // Gửi id của user cùng với các thông tin cập nhật
          // Loại bỏ mfaCode nếu nó là null hoặc undefined để tránh lỗi kiểu
          const {  ...restUserData } = userDataToUpdate;  // xoa mfacode do k sai never used
          const result = await authService.updateUser({ ...restUserData, id: user.id }, token);

          if (result.success && result.user) {
            // Chuyển đổi result.user về kiểu User nếu cần thiết
            const updatedUser: User = {
              id: result.user.id || user.id,
              username: result.user.username || user.username,
              email: result.user.email || user.email,
              full_name: result.user.full_name || user.full_name,
              phone_number: result.user.phone_number || user.phone_number,
              avatar_url: result.user.avatar_url || user.avatar_url,
              address: result.user.address || user.address,
              role: result.user.role || user.role,
            };
            set(state => ({
              user: { ...state.user, ...updatedUser } as User,
              isLoading: false,
              error: null,
            }));
            return { success: true, message: result.message, user: updatedUser };
          } else {
            const message = result.message || 'Cập nhật thông tin người dùng thất bại.';
            set({ isLoading: false, error: message });
            return { success: false, message };
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định khi cập nhật người dùng.';
          console.error('Lỗi cập nhật người dùng:', error);
          set({ error: errorMessage, isLoading: false });
          return { success: false, message: errorMessage };
        }
      },

      /**
       * Xóa thông báo lỗi hiện tại.
       */
      clearError: () => set({ error: null }),

      /**
       * Cập nhật phương thức đăng nhập
       */
      setLoginMethod: (method) => set({ loginMethod: method }),

      /**
       * Đăng xuất người dùng, xóa tất cả trạng thái xác thực.
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          loginMethod: null,
        });
        // Bạn có thể thêm logic xóa các dữ liệu khác liên quan đến phiên làm việc nếu cần
      },

      verifyVoucherByUserPoint: async (voucherCode) => {
        const { token } = get();
        if (!token) {
          return { success: false, message: 'Bạn cần đăng nhập để sử dụng mã khuyến mãi.' };
        }

        try {
          const result = await authService.verifyVoucherByUserPoint(voucherCode, token);
          return result;
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Lỗi xác minh mã khuyến mãi.';
          set({ error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },


      /**
       * Cập nhật mật khẩu người dùng
       */
      updatePassword: async (oldPassword: string, newPassword: string) => {
        const { token } = get();

        if (!token) {
          return { success: false, message: 'Người dùng chưa đăng nhập.' };
        }

        set({ isLoading: true, error: null });

        try {
          const result = await authService.updatePassword(oldPassword, newPassword, token);

          set({ isLoading: false });

          return {
            success: result.status === 200,
            message: result.message || 'Cập nhật mật khẩu thành công.',
          };
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đổi mật khẩu.';

          set({ error: errorMessage, isLoading: false });

          return { success: false, message: errorMessage };
        }
      },



      /**
       * Xác minh một token đã cho.
       * Được sử dụng để kiểm tra token từ localStorage khi khởi động ứng dụng.
       */
      verifyToken: async (token: string) => {
        if (!token) {
          console.log('No token provided for verification');
          return { success: false, message: 'No authentication token found' };
        }

        set({ isLoading: true, error: null });

        try {
          const data = await authService.verifyToken(token);
          console.log('Verify Token API Response Data:', data);

          if (data.isValid && data.decoded) {
            // Chuyển đổi dữ liệu decoded thành kiểu User của store
            const userData: User = {
              id: data.decoded.sub || data.decoded.userId || '',
              username: data.decoded.username || data.decoded.email || '',
              email: data.decoded.email || '',
              full_name: data.decoded.full_name || data.decoded.name || '',
              phone_number: data.decoded.phone_number || data.decoded.phone || '',
              avatar_url: data.decoded.avatar_url || data.decoded.picture || '',
              address: data.decoded.address || '',
              role: data.decoded.role || 'user',
              points: data.decoded.points || 0,

            };

            set((state) => ({
              user: userData,
              isAuthenticated: true,
              token: token,
              isLoading: false,
              error: null,
              // Preserve existing loginMethod if it exists
              loginMethod: state.loginMethod,
            }));
            return { success: true, user: userData, message: data.message || 'Token hợp lệ.' };
          } else {
            console.log('Token verification failed:', data.message);
            // Only clear auth state if we're certain the token is invalid
            if (data.message?.includes('expired') || data.message?.includes('invalid')) {
              set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: data.message });
              return { success: false, message: data.message };
            }
            // For other cases, don't clear auth state to prevent logout on temporary issues
            set({ isLoading: false });
            return {
              success: false,
              message: data.message || 'Không thể xác minh token. Vui lòng thử lại sau.',
              isNetworkError: true
            };
          }
        } catch (error: unknown) {
          console.error('Lỗi khi xác minh token:', error);
          // Don't clear auth state on network errors
          set({ isLoading: false });

          let errorMessage = 'Lỗi mạng khi xác minh token. Vui lòng kiểm tra kết nối của bạn.';
          if (error instanceof Error) {
            errorMessage = error.message || errorMessage;
          }

          return {
            success: false,
            message: errorMessage,
            isNetworkError: true
          };
        }
      }
    }),
    {
      name: 'auth-storage', // Tên cho localStorage
      storage: {
        // Tùy chỉnh getItem để xử lý dữ liệu từ localStorage một cách an toàn
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const data = JSON.parse(str);
            // Kiểm tra xem dữ liệu có đúng định dạng persist mong đợi không
            if (data && typeof data.state === 'object' && data.version !== undefined) {
              return data;
            } else {
              console.warn(`Dữ liệu localStorage cho '${name}' không đúng định dạng persist, cố gắng khôi phục.`);
              // Nếu data không phải là object chứa 'state', giả định đó là state cũ
              return { state: data, version: 0 };
            }
          } catch (e) {
            console.error('Lỗi phân tích cú pháp localStorage item:', name, e);
            return null; // Trả về null để zustand không khôi phục state từ localStorage
          }
        },
        // Tùy chỉnh setItem để lưu trữ toàn bộ object `value` (bao gồm `state` và `version`)
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      // Chỉ lưu các trường cần thiết vào localStorage để tránh lưu trữ quá nhiều dữ liệu không cần thiết
      partialize: (state: AuthState): Partial<AuthState> => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loginMethod: state.loginMethod,
      }),
    }
  )
);