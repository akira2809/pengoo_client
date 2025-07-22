"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { useCartStore } from '@/app/stores/slice/cartStore';
import toast from 'react-hot-toast';
import { auth, facebookProvider } from "@/app/api/firebaseClient";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';



export default function SignUpPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const [searchParams] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });
  
  // Get the redirect URL from query params, session storage, or use default
  const getRedirectPath = () => {
    // Check for explicit redirect in URL first
    const explicitRedirect = searchParams.get('redirect');
    if (explicitRedirect) return explicitRedirect;
    
    // Try to get the previous page from session storage
    if (typeof window !== 'undefined') {
      // Get the full URL including path and search params
      const fullPath = sessionStorage.getItem('preAuthFullPath');
      if (fullPath) {
        // If redirecting to checkout but cart is empty, go to home
        if (fullPath === '/checkout' && (!cartItems || cartItems.length === 0)) {
          return '/';
        }
        return fullPath;
      }
      
      // Fallback to just the path if full path is not available
      const pathOnly = sessionStorage.getItem('preAuthPath');
      if (pathOnly) {
        // If redirecting to checkout but cart is empty, go to home
        if (pathOnly === '/checkout' && (!cartItems || cartItems.length === 0)) {
          return '/';
        }
        return pathOnly;
      }
    }
    
    return '/';
  };
  
  const redirectTo = getRedirectPath();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the original page after successful signup and auto-login
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors: Record<string, string> = {};
    if (!formData.name) validationErrors.name = 'Vui lòng nhập tên';
    if (!formData.email) {
      validationErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      validationErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      validationErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const registrationResult = await register({
        username: formData.name,
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        phone_number: '', // You might want to add this field to your form
        role: 'user',
      });

      if (registrationResult.success) {
        // The useEffect will handle the redirect when isAuthenticated becomes true
        toast.success('Đăng ký và đăng nhập thành công! Đang chuyển hướng...');
      } else {
        setApiError(registrationResult.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
    }
  };

  const { verifyToken } = useAuthStore();
   // Thêm scope cho Facebook để lấy thêm thông tin
  facebookProvider.addScope('email');
  facebookProvider.addScope('public_profile');
  
  // Xử lý đăng nhập bằng Facebook
  const handleFacebookLogin = async () => {
    try {
      // Bước 1: Xác thực với Facebook
      let result;
      try {
        result = await signInWithPopup(auth, facebookProvider);
      } catch (error: unknown) {
        // Bỏ qua lỗi khi người dùng đóng popup
        if (error && typeof error === 'object' && 'code' in error) {
          const errorCode = (error as { code: string }).code;
          if (errorCode === 'auth/cancelled-popup-request' || 
              errorCode === 'auth/popup-closed-by-user') {
            return; // Không hiển thị lỗi nếu người dùng đóng popup
          }
        }
        throw error; // Ném lỗi khác để xử lý tiếp
      }
      
      const idToken = await result.user.getIdToken();

      console.log('Facebook ID Token:', idToken);

      // Bước 2: Gửi token lên backend để xác thực
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/facebook`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          idToken,
          skipMfa: true 
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Facebook API Error:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Đăng nhập Facebook thất bại');
        } catch {
          throw new Error(`Đăng nhập thất bại: ${res.status} ${res.statusText}`);
        }
      }
      
      const data = await res.json();
      console.log('Facebook API Response:', data);

      if (!data.token) {
        throw new Error("Không nhận được token từ máy chủ");
      }

      console.log('Saving Facebook token to localStorage and verifying...');
      localStorage.setItem("token", data.token);
      
      // Xác thực token bằng auth store
      const verification = await verifyToken(data.token);
      if (!verification.success) {
        throw new Error(verification.message || 'Xác thực token thất bại');
      }
      
      toast.success("Đăng nhập Facebook thành công!");
      
      // Chuyển hướng sau khi đăng nhập thành công
      if (data.profileCompleted === false) {
        toast("Vui lòng cập nhật thông tin tài khoản để sử dụng đầy đủ tính năng!", { icon: "⚠️" });
        router.push('/account');
      } else {
        router.push(redirectTo);
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi khi đăng nhập bằng Facebook";
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Bước 1: Xác thực với Google
      const provider = new GoogleAuthProvider();
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (error: unknown) {
        // Bỏ qua lỗi khi người dùng đóng popup
        if (error && typeof error === 'object' && 'code' in error) {
          const errorCode = (error as { code: string }).code;
          if (errorCode === 'auth/cancelled-popup-request' || 
              errorCode === 'auth/popup-closed-by-user') {
            return; // Không hiển thị lỗi nếu người dùng đóng popup
          }
        }
        throw error; // Ném lỗi khác để xử lý tiếp
      }
      
      const idToken = await result.user.getIdToken();

      // console.log('Google ID Token:', idToken); // Log token để debug

      // Bước 2: Gửi token lên backend để xác thực
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/google`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          idToken: idToken, // Đổi tên tham số thành 'idToken' để phù hợp với API
          skipMfa: true 
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Đăng nhập thất bại');
        } catch {
          throw new Error(`Đăng nhập thất bại: ${res.status} ${res.statusText}`);
        }
      }
      
      const data = await res.json();
      console.log('API Response Data:', data); // Log response để debug

      if (!data.token) {
        throw new Error("Không nhận được token từ máy chủ");
      }

      console.log('Saving token to localStorage and verifying...');
      localStorage.setItem("token", data.token);
      
      // Xác thực token bằng auth store
      const verification = await verifyToken(data.token);
      if (!verification.success) {
        throw new Error(verification.message || 'Xác thực token thất bại');
      }
      
      toast.success("Đăng nhập Google thành công!");
      
      // Chuyển hướng sau khi đăng nhập thành công
      if (data.profileCompleted === false) {
        toast("Vui lòng cập nhật thông tin tài khoản để sử dụng đầy đủ tính năng!", { icon: "⚠️" });
        router.push('/account');
      } else {
        router.push(redirectTo);
      }
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi khi đăng nhập bằng Google";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Image */}
     <div className="w-full md:w-1/2 h-64 md:h-screen relative">
             <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
               <div className="relative w-full h-full">
                 <Image 
                   src="/signin.jpg" 
                   alt="Sign In" 
                   fill
                   className="object-cover"
                   priority
                   sizes="(max-width: 768px) 100vw, 50vw"
                 />
               </div>
             </div>
           </div>


      {/* Right side - Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
            <p className="text-gray-600">Join us today!</p>
          </div>

          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{apiError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`w-full px-4 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`w-full px-4 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className={`w-full px-4 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`w-full px-4 py-2 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="ml-2">Đăng nhập với Google</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  <span className="ml-2">Facebook</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-center text-sm text-gray-600">
            Bạn đã có tài khoản?{' '}
            <Link 
              href={`/signin${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Đăng nhập ngay
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
