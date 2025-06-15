// src/app/(auth)/account/page.tsx
export default function AccountPage() {
    // Dữ liệu tạm
    const user = {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0987654321',
      address: '123 Đường ABC, Quận 1, TP.HCM'
    };
  
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Thông tin cá nhân</h3>
              <p className="text-gray-600">
                <span className="font-medium">Họ tên:</span> {user.name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Số điện thoại:</span> {user.phone}
              </p>
            </div>
  
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Địa chỉ mặc định</h3>
              <p className="text-gray-600">
                {user.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }