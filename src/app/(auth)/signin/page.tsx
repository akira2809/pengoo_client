'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Firebase imports commented out as they're not currently used
// import { auth, facebookProvider } from "@/app/api/firebaseClient";
// import { signInWithPopup } from 'firebase/auth';
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
            <div 
              className="w-full h-full bg-gray-200" 
              data-cy="signin-image-placeholder"
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
          <form onSubmit={handleSubmit} className="space-y-6" data-cy="login-form">
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
                data-cy="email-input"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600" data-cy="email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <Link 
                  href="/forgot-password" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                  data-cy="forgot-password-link"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`w-full pl-3 pr-10 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  data-cy="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  data-cy="toggle-password-visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" data-cy="password-error">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              data-cy="login-button"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
                data-cy="signup-link"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}