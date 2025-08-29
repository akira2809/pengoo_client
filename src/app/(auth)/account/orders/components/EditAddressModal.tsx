import { OrderWithUser } from '@/app/type/order';
import { useEffect, useState } from 'react';

interface EditAddressModalProps {
  order: OrderWithUser | null;
  onClose: () => void;
  updateOrderAddress: (orderId: number, newAddress: string, newPhoneNumber: string) => Promise<void>;
}

export function EditAddressModal({ order, onClose, updateOrderAddress }: EditAddressModalProps) {
  const [newAddress, setNewAddress] = useState(order?.shipping_address || "");
  const [newPhoneNumber, setNewPhoneNumber] = useState(order?.phone_number?.toString() || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (order) {
      setNewAddress(order.shipping_address || "");
      setNewPhoneNumber(order.phone_number?.toString() || "");
    }
  }, [order]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!newAddress.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    } else if (newAddress.length < 10) {
      newErrors.address = 'Địa chỉ quá ngắn, vui lòng nhập ít nhất 10 ký tự';
    }

    if (!newPhoneNumber.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0[35789])[0-9]{8}$/.test(newPhoneNumber)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!order || !validateForm()) return;

    setIsUpdating(true);
    try {
      await updateOrderAddress(order.id, newAddress, newPhoneNumber);
      //   console.log('update address successfully', { newAddress, newPhoneNumber });
      onClose();
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Sửa thông tin giao hàng</h2>
        <p className="text-sm text-gray-500 mb-4">Mã đơn hàng: #{order.id}</p>

        {/* Thông tin hiện tại */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Thông tin hiện tại</h3>
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Địa chỉ:</span> {order.shipping_address || "Chưa có địa chỉ"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">SĐT:</span> {order?.phone_number || "Chưa có số điện thoại"}
            </p>
          </div>
        </div>

        {/* Form cập nhật */}
        <div className="space-y-4">
          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại liên hệ *
            </label>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Nhập số điện thoại..."
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              disabled={isUpdating}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Địa chỉ mới */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ mới *
            </label>
            <textarea
              rows={3}
              className={`w-full border rounded px-3 py-2 ${errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Nhập địa chỉ mới đầy đủ..."
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              disabled={isUpdating}
            ></textarea>
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">{errors.address}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Địa chỉ cần ít nhất 10 ký tự
            </p>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  );
}