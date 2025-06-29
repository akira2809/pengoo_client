'use client';

import { useState } from 'react';

type Coupon = {
  id: string;
  code: string;
  description: string;
  pointsRequired: number;
};

export default function CouponsPage() {
  const [userPoints] = useState<number>(200); // Mock điểm người dùng
  const [inputCode, setInputCode] = useState('');
  const [message, setMessage] = useState('');
  const [userCoupons, setUserCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'SUMMER20',
      description: 'Giảm 20% cho đơn từ 200k',
      pointsRequired: 50,
    },
    {
      id: '2',
      code: 'FREESHIP',
      description: 'Miễn phí vận chuyển',
      pointsRequired: 30,
    },
  ]);

  const allCoupons: Coupon[] = [
    { id: '1', code: 'SUMMER20', description: 'Giảm 20% cho đơn từ 200k', pointsRequired: 50 },
    { id: '2', code: 'FREESHIP', description: 'Miễn phí vận chuyển', pointsRequired: 30 },
    { id: '3', code: 'WELCOME100', description: 'Giảm 100k cho đơn từ 500k', pointsRequired: 120 },
  ];

  const handleCheckCoupon = () => {
    const found = allCoupons.find((c) => c.code.toLowerCase() === inputCode.trim().toLowerCase());
    if (!found) {
      setMessage('Mã không tồn tại!');
      return;
    }

    if (userPoints >= found.pointsRequired) {
      const alreadyOwned = userCoupons.some((c) => c.code === found.code);
      if (!alreadyOwned) {
        setUserCoupons([...userCoupons, found]);
        setMessage('Đã thêm mã vào tài khoản của bạn!');
      } else {
        setMessage('Bạn đã có mã này!');
      }
    } else {
      setMessage(`Bạn cần ${found.pointsRequired} điểm để dùng mã này.`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Mã khuyến mãi</h1>

      <div className="mb-6">
        <p className="mb-2 text-sm text-gray-600">Điểm của bạn: <strong>{userPoints}</strong></p>
        <div className="relative flex items-center space-x-2">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Nhập mã khuyến mãi"
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
          />
          <button
            onClick={handleCheckCoupon}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 px-4 py-2 bg-background-900 text-white rounded-md hover:bg-background-800 text-sm"
          >
            Kiểm tra
          </button>
        </div>
        {message && <p className="mt-2 text-sm text-blue-600">{message}</p>}
      </div>
      

      <div>
        <h2 className="text-lg font-semibold mb-2">Mã bạn đang có:</h2>
        {userCoupons.length === 0 ? (
          <p className="text-gray-500">Bạn chưa có mã nào.</p>
        ) : (
          <ul className="space-y-3">
            {userCoupons.map((coupon) => (
              <li
                key={coupon.id}
                className="border rounded-md p-4 bg-gray-50"
              >
                <p className="font-medium">{coupon.code}</p>
                <p className="text-gray-600">{coupon.description}</p>
                <p className="text-sm text-gray-400">Cần {coupon.pointsRequired} điểm</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
