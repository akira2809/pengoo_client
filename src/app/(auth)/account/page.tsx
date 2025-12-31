"use client";

import { useAuthStore } from "@/app/stores/slice/useAuthStore";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "do6lj4onq";
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
// Regular img tag will be used instead of Next.js Image
import { apiClient } from "@/app/api/apiClient";

// Ensure User interface is available (can be imported from useAuthStore if defined there)
interface User {
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

export default function ModernAccountPage() {
  const { user, isAuthenticated, token, verifyToken, updateUser, logout } =
    useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [accountData, setAccountData] = useState<User | null>(null);
  const [displayedUserPoints, setDisplayedUserPoints] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const res = await apiClient.get<{ userPoints: number }>(
          "/minigame/user-points"
        );
        const points = res.data?.userPoints ?? 0;

        setDisplayedUserPoints(points);
      } catch {
        setDisplayedUserPoints(0);
      }
    };
    fetchUserPoints();
  }, []);
  // Initialize form data when user data becomes available
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        // Email sẽ không nằm trong formData nếu không muốn chỉnh sửa
        phone_number: user.phone_number || "",
        address: user.address || "",
        avatar_url: user.avatar_url || "",
      });
      setAccountData(user);
    }
    console.log("User data:", user);
  }, [user]);

  // Handle input changes for form fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidPhoneNumber = (phone: string): boolean => {
    // Kiểm tra chuỗi rỗng hoặc chỉ chứa khoảng trắng
    if (!phone || phone.trim() === "") return false;

    // Loại bỏ khoảng trắng và kiểm tra chỉ chứa số
    const cleanPhone = phone.trim();

    // Kiểm tra có chứa ký tự âm hoặc ký tự không phải số
    if (cleanPhone.includes("-") || !/^\d+$/.test(cleanPhone)) return false;

    // Kiểm tra format: bắt đầu bằng 0 và có đúng 10 số
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(cleanPhone);
  };

  // Handle form submission for updating user information
  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    if (!accountData?.id) {
      toast.error("Không tìm thấy ID người dùng để cập nhật.");
      return;
    }

    // Kiểm tra định dạng số điện thoại
    if (formData.phone_number && !isValidPhoneNumber(formData.phone_number)) {
      toast.error(
        "Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số và bắt đầu bằng 0."
      );
      return;
    }

    setLoading(true); // Show loading state during update
    try {
      // Khi gửi đi, chỉ gửi các trường trong formData (không bao gồm email nếu không muốn thay đổi)
      const updatedData = { ...formData, id: accountData.id };
      const result = await updateUser(updatedData);

      if (result.success) {
        toast.success("Cập nhật thông tin thành công!");
        // Cập nhật accountData cục bộ, giữ nguyên email từ accountData.email
        setAccountData((prev) =>
          prev ? { ...prev, ...formData, email: prev.email } : null
        );
        setIsEditing(false); // Exit editing mode
      } else {
        toast.error(result.message || "Có lỗi xảy ra khi cập nhật.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset formData to current accountData when canceling
    if (accountData) {
      setFormData({
        full_name: accountData.full_name || "",
        phone_number: accountData.phone_number || "",
        address: accountData.address || "",
        avatar_url: accountData.avatar_url || "",
      });
    }
  };

  // Authentication check effect
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated && user) {
        setAccountData(user);
        setLoading(false);
        return;
      }

      if (token) {
        try {
          setLoading(true);
          const result = await verifyToken(token);
          console.log("Kết quả xác thực token:", result);

          if (result.success) {
            if (result.user) {
              setAccountData(result.user);
            } else {
              console.error(
                "Thiếu thông tin người dùng sau khi xác thực token"
              );
              toast.error("Không tải được thông tin tài khoản.");
              if (!user) {
                logout();
                router.replace(
                  "/signin?redirect=" +
                    encodeURIComponent(window.location.pathname)
                );
                return;
              }
            }
          } else {
            const errorMessage =
              result?.message || "Không thể xác thực phiên đăng nhập";
            console.error(
              "Xác thực token thất bại trong AccountPage:",
              errorMessage,
              result
            );

            toast.error("Phiên đăng nhập đã hết hạn hoặc không hợp lệ.");

            logout();
            router.replace(
              "/signin?redirect=" + encodeURIComponent(window.location.pathname)
            );
            return;
          }
        } catch (error) {
          console.error(
            "Lỗi trong quá trình verifyToken từ AccountPage:",
            error
          );
          toast.error("Có lỗi xảy ra khi xác thực phiên đăng nhập.");
          logout();
          router.replace("/signin");
          return;
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        router.replace("/signin");
      }
    };

    checkAuth();
  }, [isAuthenticated, router, token, user, verifyToken, logout]);

  // --- UI Rendering ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="backdrop-blur-sm bg-white/70 shadow-2xl rounded-3xl p-8 border border-white/20 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy thông tin tài khoản
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập lại để tiếp tục
          </p>
          <button
            onClick={() => router.replace("/signin")}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-br from-pink-400 to-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Main Container */}
        <div className="backdrop-blur-sm bg-white/70 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 transform transition-all duration-500 hover:shadow-3xl">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-8 py-8 sm:py-12">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex flex-col items-center space-y-6 sm:space-y-0 sm:flex-row sm:justify-between">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                {/* Avatar with glow effect */}
                <div className="relative group flex-shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                    {formData.avatar_url ? (
                      <img
                        src={formData.avatar_url}
                        alt="Ảnh đại diện"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          // Fallback to default avatar if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                          {accountData.username?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-white rounded-full text-indigo-600 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                      {isUploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
                          
                          const file = files[0];
                          
                          // Validate file type
                          if (!file.type.match('image.*')) {
                            toast.error('Vui lòng chọn file ảnh hợp lệ');
                            return;
                          }
                          
                          // Validate file size (max 20MB to match ReturnOrderModal)
                          if (file.size > 20 * 1024 * 1024) {
                            toast.error('File quá lớn! Tối đa 20MB.');
                            return;
                          }
                          
                          setIsUploading(true);
                          
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                          formData.append('folder', 'avatars');
                          
                          const xhr = new XMLHttpRequest();
                          xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`);
                          
                          // Progress tracking can be added here if needed
                          
                          xhr.onload = () => {
                            if (xhr.status === 200) {
                              const data = JSON.parse(xhr.responseText);
                              setFormData(prev => ({
                                ...prev,
                                avatar_url: data.secure_url
                              }));
                              toast.success('Tải ảnh đại diện lên thành công');
                            } else {
                              toast.error('Có lỗi xảy ra khi tải ảnh lên');
                            }
                            setIsUploading(false);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          };
                          
                          xhr.onerror = () => {
                            toast.error('Lỗi kết nối mạng');
                            setIsUploading(false);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          };
                          
                          xhr.send(formData);
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="text-center sm:text-left flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg break-words">
                    {accountData.full_name || accountData.username}
                  </h1>
                  <p className="text-indigo-100 text-base sm:text-lg mb-2 break-all">
                    @{accountData.username}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {displayedUserPoints ?? 0} điểm
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0 w-full sm:w-auto">
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-2 border border-white/30 text-sm sm:text-base"
                    >
                      <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Hủy</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm sm:text-base"
                    >
                      {loading ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                      <span>Lưu</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                  >
                    <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-8 lg:p-12">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              {/* Personal Information Card */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex-shrink-0">
                    <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Thông tin cá nhân
                  </h2>
                </div>

                {/* Full Name Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <p className="text-gray-900 font-medium text-sm sm:text-base break-words">
                        {accountData.full_name || "Chưa cập nhật"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Phone Field */}
                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <PhoneIcon className="w-4 h-4 flex-shrink-0" />
                    <span>Số điện thoại</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <p className="text-gray-900 font-medium text-sm sm:text-base break-all">
                        {accountData.phone_number || "Chưa cập nhật"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Email Field (Read-only) */}
                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
                    <span>Email</span>
                  </label>
                  <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <p className="text-gray-900 font-medium text-sm sm:text-base break-all">
                      {accountData.email}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Email không thể thay đổi
                    </p>
                  </div>
                </div>
              </div>

              {/* Address and Additional Info */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex-shrink-0">
                    <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Địa chỉ & Khác
                  </h2>
                </div>

                {/* Address Field */}
                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span>Địa chỉ</span>
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-white/50 backdrop-blur-sm resize-none text-sm sm:text-base"
                      placeholder="Nhập địa chỉ của bạn"
                    />
                  ) : (
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 min-h-[80px] sm:min-h-[100px] flex items-center">
                      <p className="text-gray-900 font-medium leading-relaxed text-sm sm:text-base break-words">
                        {accountData.address || "Chưa cập nhật địa chỉ"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Static Info Cards */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <h3 className="text-sm font-semibold text-orange-700 mb-1">
                      Tên đăng nhập
                    </h3>
                    <p className="text-orange-900 font-bold text-sm sm:text-base break-all">
                      @{accountData.username}
                    </p>
                  </div>
                </div>

                {/* Points Display */}
                <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="text-center sm:text-left">
                      <h3 className="text-base sm:text-lg font-semibold mb-1">
                        Điểm tích lũy
                      </h3>
                      <p className="text-indigo-100 text-sm sm:text-base">
                        Điểm hiện tại của bạn
                      </p>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-2xl sm:text-3xl font-bold">
                        {displayedUserPoints ?? 0}
                      </p>
                      <div className="flex items-center justify-center sm:justify-end mt-1">
                        <StarIcon className="w-4 h-4 text-yellow-300 mr-1 flex-shrink-0" />
                        <span className="text-sm text-indigo-100">điểm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
