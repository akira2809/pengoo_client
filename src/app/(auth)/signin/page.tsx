'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [searchParams] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });
  
  // Get the redirect URL from query params or use the current page as fallback
  const getRedirectPath = () => {
    // Check for explicit redirect in URL first
    const explicitRedirect = searchParams.get('redirect');
    if (explicitRedirect) return explicitRedirect;
    
    // If no explicit redirect, try to get the previous page from session storage
    if (typeof window !== 'undefined') {
      // Get the full URL including path and search params
      const fullPath = sessionStorage.getItem('preAuthFullPath');
      if (fullPath) return fullPath;
      
      // Fallback to just the path if full path is not available
      const pathOnly = sessionStorage.getItem('preAuthPath');
      if (pathOnly) return pathOnly;
    }
    
    return '/';
  };
  
  const redirectTo = getRedirectPath();
  const fromSignup = searchParams.get('from') === 'signup';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [mfaStep, setMfaStep] = useState(false); // legacy MFA state
  // const [mfaCode, setMfaCode] = useState('');    // legacy MFA state
  // const [mfaLoading, setMfaLoading] = useState(false); // legacy MFA state
  // const [googleEmail, setGoogleEmail] = useState(''); // legacy MFA state

  useEffect(() => {
    if (isAuthenticated) {
      // If coming from signup, show success message
      if (fromSignup) {
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        // Remove the 'from' param to avoid showing the message again on refresh
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('from');
        router.replace(`/signin?${newParams.toString()}`);
      } else {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, router, redirectTo, fromSignup, searchParams]);

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
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Submit email/password (now uses simple-login, no MFA)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const result = await login(formData);
      if (result.success) {
        toast.success("Đăng nhập thành công!");
        // The redirect will be handled by the useEffect above
      } else {
        toast.error(result.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Đã xảy ra lỗi khi đăng nhập");
    }
  };

  // Step 2: Submit MFA code (legacy, commented)
  // const handleVerifyMfa = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setMfaLoading(true);
  //   try {
  //     const emailToUse = googleEmail || formData.email;
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/verify-mfa`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email: emailToUse, code: mfaCode }),
  //     });
  //     const data = await res.json();
  //     if (res.ok && data.token) {
  //       localStorage.setItem("token", data.token);
  //       await verifyToken(data.token);
  //       toast.success("Đăng nhập thành công!");
  //       router.push('/');
  //     } else {
  //       toast.error(data.message || "Mã xác thực không đúng hoặc đã hết hạn.");
  //     }
  //   } catch {
  //     toast.error("Đã xảy ra lỗi khi xác thực mã.");
  //   }
  //   setMfaLoading(false);
  // };

  // Google login (now skips MFA for main site)
  // Google login handler (commented out as it's not being used)
  // const handleGoogleLogin = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     const result = await signInWithPopup(auth, provider);
  //     const idToken = await result.user.getIdToken();

  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/google`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ idToken, skipMfa: true }),
  //     });
  //     const data = await res.json();

  //     if (res.ok && data.token) {
  //       localStorage.setItem("token", data.token);
  //       await verifyToken(data.token);
  //       toast.success("Đăng nhập Google thành công!");
  //       if (!data.profileCompleted) {
  //         toast("Vui lòng cập nhật thông tin tài khoản để sử dụng đầy đủ tính năng!", { icon: "⚠️" });
  //         router.push('/account');
  //       } else {
  //         router.push(redirectTo);
  //       }
  //     } else {
  //       toast.error(data.message || "Đăng nhập Google thất bại");
  //     }
  //   } catch (err) {
  //     console.error('Google login error:', err);
  //     toast.error("Đã xảy ra lỗi khi đăng nhập bằng Google");
  //   }
  // };

  // Facebook login handler (commented out as it's not being used)
  // const handleFacebookLogin = async () => {
  //   try {
  //     // Ensure FB SDK is loaded
  //     if (!(window as any).FB) {
  //       toast.error("Facebook SDK chưa được tải.");
  //       return;
  //     }
  //     (window as any).FB.login((response: any) => {
  //       if (response.authResponse) {
  //         (async () => {
  //           const accessToken = response.authResponse.accessToken;
  //           const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/facebook`, {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({ accessToken, skipMfa: true }),
  //           });
  //           const data = await res.json();

  //           if (res.ok && data.token) {
  //             localStorage.setItem("token", data.token);
  //             await verifyToken(data.token);
  //             toast.success("Đăng nhập Facebook thành công!");
  //             router.push(redirectTo);
  //           } else {
  //             toast.error(data.message || "Đăng nhập Facebook thất bại");
  //           }
  //         })();
  //       } else {
  //         toast.error("Đã hủy đăng nhập Facebook");
  //       }
  //     }, { scope: 'email' });
  //   } catch (err) {
  //     console.error('Facebook login error:', err);
  //     toast.error("Đã xảy ra lỗi khi đăng nhập bằng Facebook");
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Image */}
      <div className="w-full md:w-1/2 h-64 md:h-screen relative">
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image 
              src="/dorroo1.jpg" 
              alt="Sign In" 
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Please sign in to your account</p>
          </div>

          {/* Legacy MFA logic (commented) */}
          {/* {!mfaStep ? ( */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>
          {/* ) : (
            <form onSubmit={handleVerifyMfa} className="space-y-6">
              <div>
                <label htmlFor="mfaCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Mã xác thực đã gửi tới email
                </label>
                <input
                  type="text"
                  id="mfaCode"
                  name="mfaCode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mã xác thực"
                  value={mfaCode}
                  onChange={e => setMfaCode(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={mfaLoading}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${mfaLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {mfaLoading ? 'Đang xác thực...' : 'Xác nhận mã'}
              </button>
            </form>
          )} */}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Sign in with Facebook</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="mt-4 text-center text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}