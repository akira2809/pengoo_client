"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/api/firebaseClient";
import Image from "next/image";
import { useAuthStore } from "@/app/stores/slice/useAuthStore";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError } =
    useAuthStore();
  const [searchParams] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  // Get the redirect URL from query params or use the current page as fallback
  const getRedirectPath = () => {
    // Check for explicit redirect in URL first
    const explicitRedirect = searchParams.get("redirect");
    if (explicitRedirect) return explicitRedirect;

    // If no explicit redirect, try to get the previous page from session storage
    if (typeof window !== "undefined") {
      // Get the full URL including path and search params
      const fullPath = sessionStorage.getItem("preAuthFullPath");
      if (fullPath) return fullPath;

      // Fallback to just the path if full path is not available
      const pathOnly = sessionStorage.getItem("preAuthPath");
      if (pathOnly) return pathOnly;
    }

    return "/";
  };

  const redirectTo = getRedirectPath();
  const fromSignup = searchParams.get("from") === "signup";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        // Remove the 'from' param to avoid showing the message again on refresh
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("from");
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
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
      console.error("Login error:", error);
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
  // Lấy các hàm từ auth store
  const { verifyToken, setLoginMethod } = useAuthStore();

  const handleGoogleLogin = async () => {
    try {
      // Bước 1: Xác thực với Google
      const provider = new GoogleAuthProvider();
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (error: unknown) {
        // Bỏ qua lỗi khi người dùng đóng popup
        if (error && typeof error === "object" && "code" in error) {
          const errorCode = (error as { code: string }).code;
          if (
            errorCode === "auth/cancelled-popup-request" ||
            errorCode === "auth/popup-closed-by-user"
          ) {
            return; // Không hiển thị lỗi nếu người dùng đóng popup
          }
        }
        throw error; // Ném lỗi khác để xử lý tiếp
      }

      const idToken = await result.user.getIdToken();

      // console.log('Google ID Token:', idToken); // Log token để debug

      // Bước 2: Gửi token lên backend để xác thực
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ||
          "https://pengoo-back-end.vercel.app"
        }/api/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: idToken, // Đổi tên tham số thành 'idToken' để phù hợp với API
            skipMfa: true,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Đăng nhập thất bại");
        } catch {
          throw new Error(
            `Đăng nhập thất bại: ${res.status} ${res.statusText}`
          );
        }
      }

      const data = await res.json();
      console.log("API Response Data:", data); // Log response để debug

      const token = data.access_token || data.token;
      if (!token) {
        throw new Error("Không nhận được token từ máy chủ");
      }
      localStorage.setItem("token", token);
      const verification = await verifyToken(token);
      if (!verification.success) {
        throw new Error(verification.message || "Xác thực token thất bại");
      }

      // Set login method to track how user logged in
      setLoginMethod("google");

      toast.success("Đăng nhập Google thành công!");

      // Chuyển hướng sau khi đăng nhập thành công
      if (data.profileCompleted === false) {
        toast(
          "Vui lòng cập nhật thông tin tài khoản để sử dụng đầy đủ tính năng!",
          { icon: "⚠️" }
        );
        router.push("/account");
      } else {
        router.push(redirectTo);
      }
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi đăng nhập bằng Google";
      toast.error(errorMessage);
    }
  };

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

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Please sign in to your account</p>
          </div>

          {/* Legacy MFA logic (commented) */}
          {/* {!mfaStep ? ( */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
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
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
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
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
