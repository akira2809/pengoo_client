// src/services/authService.ts

// Nên sử dụng biến môi trường cho các URL API trong ứng dụng thực tế
// Ví dụ: process.env.NEXT_PUBLIC_AUTH_API_URL
const AUTH_API_BASE_URL = 'http://localhost:3000/api/auth';
const USERS_API_BASE_URL = 'http://localhost:3000/users';

// Định nghĩa lại UserApiData để phản ánh chính xác từ backend API
export interface UserApiData { // Export để có thể dùng trong store
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  avatar_url: string;
  address: string;
  role: string;
  points?: number; 
}

// Responses từ API của bạn
interface SignInResponse {
  access_token?: string; // Đặt là optional vì có thể không có nếu lỗi
  message?: string;
  error?: string;
}

interface VerifyDecodedData {
  sub?: string;
  userId?: string;
  username?: string;
  email?: string;
  full_name?: string;
  name?: string; // Một số API có thể trả về 'name' thay vì 'full_name'
  phone_number?: string;
  phone?: string; // Một số API có thể trả về 'phone' thay vì 'phone_number'
  avatar_url?: string;
  picture?: string; // Một số API có thể trả về 'picture' thay vì 'avatar_url'
  address?: string;
  role?: string;
  points?: number;
}

interface VerifyResponse {
  isValid: boolean;
  decoded?: VerifyDecodedData;
  user?: UserApiData; // Nếu API verify trả về trực tiếp user object thay vì chỉ decoded token
  message?: string;
  error?: string;
}

interface RegisterResponse {
  message?: string;
  error?: string;
  // Thêm các trường này vào RegisterResponse để phản ánh phản hồi từ backend
  id?: number; // Backend trả về id là number
  username?: string;
  full_name?: string;
  password?: string; // Mặc dù là password hashed, backend vẫn trả về nó
  email?: string;
  phone_number?: string;
  avatar_url?: string;
  address?: string;
  role?: string;
  // ... thêm bất kỳ trường nào khác mà backend có thể trả về sau khi đăng ký
}

interface ApiResponse {
  message?: string;
  error?: string;
}

export const authService = {
  /**
   * Gửi yêu cầu đăng nhập và trả về access token.
   */
  signIn: async (credentials: { email: string; password: string }): Promise<SignInResponse> => {
    const response = await fetch(`${AUTH_API_BASE_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data: SignInResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
    if (!data.access_token) {
      throw new Error('Không nhận được mã xác thực từ máy chủ.');
    }
    return data;
  },

  /**
   * Gửi yêu cầu đăng ký người dùng mới.
   * Backend sẽ trả về message thành công hoặc lỗi, hoặc dữ liệu người dùng đã tạo.
   */
  register: async (userData: {
    username: string;
    password: string;
    full_name: string;
    email: string;
    phone_number: string;
    avatar_url?: string;
    address?: string;
    role?: string;
  }): Promise<RegisterResponse> => {
    const response = await fetch(`${USERS_API_BASE_URL}/register`, { // Sửa endpoint đăng ký
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...userData,
        role: userData.role || 'user',
        avatar_url: userData.avatar_url || '',
        address: userData.address || '',
      }),
    });

    const data: RegisterResponse = await response.json();

    if (!response.ok) {
      console.error("Backend Register Error Response (HTTP !OK):", data);
      throw new Error(data.message || data.error || 'Đăng ký thất bại. Vui lòng thử lại sau.');
    }
    
    // Nếu backend trả về 200 OK nhưng trong body có trường error, vẫn coi là lỗi logic
    if (data.error) {
        throw new Error(data.error);
    }

    return data; // Trả về tất cả dữ liệu từ backend
  },

  /**
   * Xác minh tính hợp lệ của một token và trả về thông tin được giải mã.
   */
  verifyToken: async (token: string): Promise<VerifyResponse> => {
    const response = await fetch(`${AUTH_API_BASE_URL}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data: VerifyResponse = await response.json();

    // Nếu response không OK hoặc isValid là false, coi là token không hợp lệ
    if (!response.ok || !data.isValid) {
      throw new Error(data.message || data.error || 'Token xác thực không hợp lệ.');
    }
    return data;
  },

  /**
   * Gửi yêu cầu đặt lại mật khẩu bằng email.
   */
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await fetch(`${AUTH_API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Yêu cầu đặt lại mật khẩu thất bại.');
    }
    return { message: data.message || 'Email đặt lại mật khẩu đã được gửi thành công.' };
  },

  /**
   * Đặt lại mật khẩu bằng token và mật khẩu mới.
   */
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse> => {
    const response = await fetch(`${AUTH_API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Đặt lại mật khẩu thất bại.');
    }
    return { message: data.message || 'Mật khẩu đã được đặt lại thành công.' };
  },

  /**
   * Cập nhật thông tin người dùng.
   * Endpoint: /api/users/update
   * Method: PUT (hoặc PATCH tùy API)
   * Yêu cầu token trong Authorization header.
   */
  updateUser: async (userData: Partial<UserApiData> & { id: string }, token: string): Promise<{ success: boolean; message: string; user?: UserApiData }> => {
    const response = await fetch(`${USERS_API_BASE_URL}/update/${userData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    });

    const updateResult = await response.json();

    if (!response.ok) {
      return { success: false, message: updateResult.error || updateResult.message || 'Cập nhật người dùng thất bại' };
    }
    return { success: true, message: updateResult.message || 'Cập nhật người dùng thành công', user: updateResult };
  },

  /**
   * Cập nhật mật khẩu người dùng
   */
  updatePassword: async (currentPassword: string, newPassword: string, token: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${AUTH_API_BASE_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Đổi mật khẩu thất bại');
    }

    return {
      success: true,
      message: data.message || 'Đổi mật khẩu thành công',
    };
  },

  /**
 * Người dùng nhập mã khuyến mãi để đổi voucher (dựa trên điểm)
 * Endpoint: POST /coupons/verify-voucher
 */


};