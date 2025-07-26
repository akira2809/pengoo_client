"use client";

import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { PencilIcon, CheckIcon, XMarkIcon, UserIcon, PhoneIcon, MapPinIcon, EnvelopeIcon, StarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { apiClient } from '@/app/api/apiClient';

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
  const { user, isAuthenticated, token, verifyToken, updateUser, logout } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [accountData, setAccountData] = useState<User | null>(null);
const [displayedUserPoints, setDisplayedUserPoints] = useState<number>(0);
useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const res = await apiClient.get<{ userPoints: number }>("/minigame/user-points");
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
        full_name: user.full_name || '',
        // Email sẽ không nằm trong formData nếu không muốn chỉnh sửa
        phone_number: user.phone_number || '',
        address: user.address || '',
        avatar_url: user.avatar_url || ''
      });
      setAccountData(user);
    }
      console.log('User data:', user);
  }, [user]);

  // Handle input changes for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for updating user information
  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (!accountData?.id) {
      toast.error('Không tìm thấy ID người dùng để cập nhật.');
      return;
    }

    setLoading(true); // Show loading state during update
    try {
      // Khi gửi đi, chỉ gửi các trường trong formData (không bao gồm email nếu không muốn thay đổi)
      const updatedData = { ...formData, id: accountData.id };
      const result = await updateUser(updatedData);

      if (result.success) {
        toast.success('Cập nhật thông tin thành công!');
        // Cập nhật accountData cục bộ, giữ nguyên email từ accountData.email
        setAccountData(prev => prev ? { ...prev, ...formData, email: prev.email } : null);
        setIsEditing(false); // Exit editing mode
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi cập nhật.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin.');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset formData to current accountData when canceling
    if (accountData) {
      setFormData({
        full_name: accountData.full_name || '',
        phone_number: accountData.phone_number || '',
        address: accountData.address || '',
        avatar_url: accountData.avatar_url || ''
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
          console.log('Kết quả xác thực token:', result);

          if (result.success) {
            if (result.user) {
              setAccountData(result.user);
            } else {
              console.error('Thiếu thông tin người dùng sau khi xác thực token');
              toast.error('Không tải được thông tin tài khoản.');
              if (!user) {
                logout();
                router.replace('/signin?redirect=' + encodeURIComponent(window.location.pathname));
                return;
              }
            }
          } else {
            const errorMessage = result?.message || 'Không thể xác thực phiên đăng nhập';
            console.error('Xác thực token thất bại trong AccountPage:', errorMessage, result);

            toast.error('Phiên đăng nhập đã hết hạn hoặc không hợp lệ.');

            logout();
            router.replace('/signin?redirect=' + encodeURIComponent(window.location.pathname));
            return;
          }
        } catch (error) {
          console.error('Lỗi trong quá trình verifyToken từ AccountPage:', error);
          toast.error('Có lỗi xảy ra khi xác thực phiên đăng nhập.');
          logout();
          router.replace('/signin');
          return;
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        router.replace('/signin');
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy thông tin tài khoản</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập lại để tiếp tục</p>
          <button
            onClick={() => router.replace('/signin')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Main Container */}
        <div className="backdrop-blur-sm bg-white/70 shadow-2xl rounded-3xl overflow-hidden border border-white/20 transform transition-all duration-500 hover:shadow-3xl">
          
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-12">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 sm:mb-0">
                {/* Avatar with glow effect */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                    {formData.avatar_url ? (
                      <Image
                        src={formData.avatar_url}
                        alt="Ảnh đại diện"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {accountData.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full text-indigo-600 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                      <PencilIcon className="w-4 h-4" />
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData(prev => ({
                                ...prev,
                                avatar_url: reader.result as string
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                    {accountData.full_name || accountData.username}
                  </h1>
                  <p className="text-indigo-100 text-lg mb-2">@{accountData.username}</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <StarIcon className="w-5 h-5 text-yellow-300" />
                    <span className="text-white font-semibold">{accountData.points ?? 0} điểm</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 border border-white/30"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    <span>Hủy</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <CheckIcon className="w-5 h-5" />
                    )}
                    <span>Lưu</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <PencilIcon className="w-5 h-5" />
                  <span>Chỉnh sửa</span>
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Personal Information Card */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
                </div>

                {/* Full Name Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <p className="text-gray-900 font-medium">{accountData.full_name || 'Chưa cập nhật'}</p>
                    </div>
                  )}
                </div>

                {/* Phone Field */}
                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <PhoneIcon className="w-4 h-4" />
                    <span>Số điện thoại</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <p className="text-gray-900 font-medium">{accountData.phone_number || 'Chưa cập nhật'}</p>
                    </div>
                  )}
                </div>

                {/* Email Field (Read-only) */}
                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>Email</span>
                  </label>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <p className="text-gray-900 font-medium">{accountData.email}</p>
                    <p className="text-xs text-blue-600 mt-1">Email không thể thay đổi</p>
                  </div>
                </div>
              </div>

              {/* Address and Additional Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                    <MapPinIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Địa chỉ & Khác</h2>
                </div>

                {/* Address Field */}
                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>Địa chỉ</span>
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-white/50 backdrop-blur-sm resize-none"
                      placeholder="Nhập địa chỉ của bạn"
                    />
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 min-h-[100px] flex items-center">
                      <p className="text-gray-900 font-medium leading-relaxed">{accountData.address || 'Chưa cập nhật địa chỉ'}</p>
                    </div>
                  )}
                </div>

                {/* Static Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <h3 className="text-sm font-semibold text-purple-700 mb-1">Vai trò</h3>
                    <p className="text-purple-900 font-bold">{accountData.role}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <h3 className="text-sm font-semibold text-orange-700 mb-1">Tên đăng nhập</h3>
                    <p className="text-orange-900 font-bold">@{accountData.username}</p>
                  </div>
                </div>

                {/* Points Display */}
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Điểm tích lũy</h3>
                      <p className="text-indigo-100">Điểm hiện tại của bạn</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{accountData.points ?? 0}</p>
                      <div className="flex items-center mt-1">
                        <StarIcon className="w-4 h-4 text-yellow-300 mr-1" />
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