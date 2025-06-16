"use client";

import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
}

export default function AccountPage() {
  const { user, isAuthenticated, token, verifyToken, updateUser, logout } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [accountData, setAccountData] = useState<User | null>(null);

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
  }, [user]);

  // Handle input changes for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for updating user information
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
        <p className="text-xl text-gray-700 mb-4">Không tìm thấy thông tin tài khoản.</p>
        <button
          onClick={() => router.replace('/signin')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition duration-200"
        >
          Đăng nhập lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.005]">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-8 sm:px-10">
            {/* Header section with title and action buttons */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900">Thông tin tài khoản</h1>
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
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
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                  >
                    <XMarkIcon className="h-5 w-5 mr-2 -ml-1" /> Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                  >
                    <CheckIcon className="h-5 w-5 mr-2 -ml-1" /> Lưu thay đổi
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                >
                  <PencilIcon className="h-5 w-5 mr-2 -ml-1" /> Chỉnh sửa hồ sơ
                </button>
              )}
            </div>

            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8 pb-8 border-b border-gray-200">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  {formData.avatar_url ? ( // Use formData for avatar when editing
                    <img
                      src={formData.avatar_url}
                      alt="Ảnh đại diện"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-semibold text-gray-500">
                      {accountData.full_name?.charAt(0).toUpperCase() || accountData.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white cursor-pointer shadow-md hover:bg-indigo-700 transition duration-200">
                    <PencilIcon className="h-5 w-5" />
                    <input
                      id="avatar-upload"
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

              <div className="flex-1 text-center sm:text-left">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        value={formData.full_name || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      />
                    </div>
                    {/* EMAIL FIELD - ALWAYS READ-ONLY */}
                    <div className="col-span-1"> {/* This div ensures it takes full width or half if in a grid */}
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-base text-gray-900 bg-gray-50 rounded-md p-2 border border-gray-200">
                        {accountData.email}
                      </p>
                    </div>
                    {/* END EMAIL FIELD */}
                    <div>
                      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone_number"
                        id="phone_number"
                        value={formData.phone_number || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      />
                    </div>
                    {/* Username is usually not editable */}
                    <div className="col-span-1">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Tên người dùng</label>
                      <p className="mt-1 text-base text-gray-900 bg-gray-50 rounded-md p-2 border border-gray-200">{accountData.username}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xl font-semibold text-gray-900 leading-tight">
                      {accountData.full_name || accountData.username || 'Chưa cập nhật'}
                    </p>
                    <p className="text-base text-gray-600">{accountData.email}</p>
                    <p className="text-base text-gray-600">
                      {accountData.phone_number || 'Chưa cập nhật số điện thoại'}
                    </p>
                    <p className="text-sm text-gray-500">Tên người dùng: {accountData.username}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Địa chỉ</h2>
              {isEditing ? (
                <textarea
                  id="address"
                  name="address"
                  rows={4}
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  placeholder="Nhập địa chỉ của bạn"
                />
              ) : (
                <p className="mt-1 text-base text-gray-700 leading-relaxed">
                  {accountData.address || 'Chưa cập nhật địa chỉ'}
                </p>
              )}
            </div>

            {/* Role and other static info (if any) */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin khác</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Vai trò</dt>
                  <dd className="mt-1 text-base text-gray-900">{accountData.role}</dd>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}