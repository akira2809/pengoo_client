'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { orderService } from '@/app/api/services/orderService';
import { ProductPagination } from '@/app/(public)/products/component/layouts/product/ProductPagination';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';
import { CreateOrderResponse, OrderItemDetail } from '@/app/type/order';
import toast from 'react-hot-toast';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "diishpkrl";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_unsigned_preset";

// --- Type Definitions ---
export interface OrderWithUser extends Omit<CreateOrderResponse, 'details'> {
  user?: {
    id: number | string;
    username?: string;
    full_name?: string;
    email?: string;
    phone_number?: number;
    avatar_url?: string;
  };
  delivery?: {
    name?: string;
    description?: string;
    fee?: string | number;
    estimatedTime?: string;
  };
  details?: OrderItemDetail[];
  order_date?: string;
  order_code: string; 
  total_price: number;
  shipping_address?: string;
  payment_type?: string;
  productStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  [key: string]: unknown;
}
interface IBank {
  name: string;
  bin:string,
  logo:string,
  id:number
}
// --- Status Configuration ---
const STATUS_CONFIG = {
  pending: { text: 'Chờ xác nhận', style: 'bg-yellow-100 text-yellow-800' },
  processing: { text: 'Đang xử lý', style: 'bg-blue-100 text-blue-800' },
  shipped: { text: 'Đang giao hàng', style: 'bg-purple-100 text-purple-800' },
  delivered: { text: 'Đã giao', style: 'bg-green-100 text-green-800' },
  cancelled: { text: 'Đã hủy', style: 'bg-red-100 text-red-800' },
  default: { text: 'Không rõ', style: 'bg-gray-100 text-gray-800' },
};

export function OrdersContent() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null);

  const [returnOrder, setReturnOrder] = useState<OrderWithUser | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnMessage, setReturnMessage] = useState('');
  const [returnVideo, setReturnVideo] = useState<string | null>(null);
  const [returnImages, setReturnImages] = useState<string[]>([]);

  
  // --- Ngân hàng ---
  const [listBank, setListBank] = useState<IBank[]>([]);
  const [selectedBank, setSelectedBank] = useState<IBank | null>(null);
  const [showBankList, setShowBankList] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // State cho upload (ảnh & video)
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const response = await orderService.getAllOrders();
        if (response?.data) {
          const allOrders = response.data as unknown as OrderWithUser[];
          const userOrders = allOrders
            .filter(order => order.user?.id === user.id)
            .sort((a, b) => new Date(b.order_date as string).getTime() - new Date(a.order_date as string).getTime());
          setOrders(userOrders);
        }
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);
  useEffect(() => {
  const fetchListBank = async () => {
      const res = await fetch('https://api.vietqr.io/v2/banks')
      const data = await res.json()
      console.log('Danh sách ngân hàng:', data)
      setListBank(data.data)
      // console.log('Danh sách ngân hàng:', data)
    }
    fetchListBank()
  },[])
  // --- Helper Functions ---
  const formatPrice = (price: unknown) => {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericPrice);
  };

  const formatOrderDate = (dateString: unknown) => {
    if (typeof dateString !== 'string') return 'Ngày không hợp lệ';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const handleCancelOrder = async (orderId: number | string) => {
    if (!window.confirm('Bạn có chắc chắn muốn huỷ đơn hàng này?')) return;
    try {
      const numericOrderId = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;
      if (isNaN(numericOrderId)) throw new Error('ID đơn hàng không hợp lệ');
      
      await orderService.cancelOrder(numericOrderId);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, productStatus: 'cancelled' } : order
        )
      );
    } catch (error) {
      console.error('Lỗi khi huỷ đơn hàng:', error);
      alert('Có lỗi xảy ra khi huỷ đơn hàng. Vui lòng thử lại sau.');
    }
  };

  

 // --- Hoàn đơn hàng ---
const handleSubmitReturn = () => {
  const newErrors: {[key: string]: string} = {};

  if (!returnReason) {
    newErrors.reason = 'Vui lòng chọn lý do hoàn đơn';
  }
  if (returnReason === 'other' && !returnMessage.trim()) {
    newErrors.message = 'Vui lòng nhập lý do chi tiết';
  }
  if (!selectedBank) {
    newErrors.bank = 'Vui lòng chọn ngân hàng';
  }
  if (!accountNumber.trim()) {
    newErrors.account = 'Vui lòng nhập số tài khoản';
  } else if (!/^\d+$/.test(accountNumber.trim())) {
    newErrors.account = 'Số tài khoản không hợp lệ';
  }
  if (returnImages.length > 5) {
    newErrors.images = 'Bạn chỉ được chọn tối đa 5 hình ảnh';
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  } 

  // Clear error nếu hợp lệ
  setErrors({});

  // Demo gửi formdata
  const formData = new FormData();
  formData.append('orderId', String(returnOrder?.id));
  formData.append('reason', returnReason);
  formData.append('message', returnMessage);
  formData.append('bank', selectedBank?.name || '');
  formData.append('accountNumber', accountNumber);
  if (returnVideo) {
    formData.append('video', returnVideo);
  }
  returnImages.forEach((file, idx) => {
    formData.append(`images[${idx}]`, file);
  });

  console.log('FormData gửi đi:', { reason: returnReason, message: returnMessage, bank: selectedBank, accountNumber });

  alert('Yêu cầu hoàn đơn đã được gửi!');
  setReturnOrder(null);
  setReturnReason('');
  setReturnMessage('');
  setReturnVideo(null);
  setReturnImages([]);
  setSelectedBank(null);
  setAccountNumber('');
  setErrors({});
};

  // --- Render Functions ---
  const renderOrderItems = (order: OrderWithUser) => {
    if (!order.details || order.details.length === 0) {
      return <p className="py-4 text-center text-gray-500">Không có thông tin sản phẩm.</p>;
    }
    return order.details.map((item, index) => {
      type ProductInfo = {
        product_name?: string;
        images?: { url: string; name?: string }[];
      };

      const product: ProductInfo = (item as { product?: ProductInfo }).product || {};
      const productName = product.product_name || `Mã sản phẩm: ${item.productId}`;
      const productImages = product.images || [];
      let imageUrl = "https://via.placeholder.com/150";
      if (Array.isArray(productImages) && productImages.length > 0) {
        const mainImgObj = productImages.find(
          (img) => img.name && img.name.trim().toLowerCase() === "main"
        );
        imageUrl = mainImgObj?.url || productImages[0].url || imageUrl;
      }
      return (
        <div key={`${item.productId}-${index}`} className="flex items-center space-x-4 py-3">
          <Image
            src={imageUrl}
            alt={productName}
            width={80}
            height={80}
            className="h-20 w-20 rounded-md object-cover bg-gray-100"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">
              {productName}
            </h4>
            <p className="text-sm text-gray-500">Số lượng: {item.quantity ?? 0}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-800">{formatPrice(item.price)}</p>
          </div>
        </div>
      );
    });
  };


  // Hàm upload file lên Cloudinary
const handleUploadToCloudinary = async (files: FileList, type: "image" | "video") => {
  if (!files || files.length === 0) return;

  setUploading(true);
  setUploadProgress(0);

  try {
    const uploads = Array.from(files).map((file) => {
      return new Promise<string>((resolve, reject) => {
        if (file.size > 20 * 1024 * 1024) {
          toast.error("File quá lớn! Tối đa 20MB.");
          return reject();
        }


        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", "orders");

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(percent));
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            resolve(data.secure_url);
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(formData);
      });
    });

    const urls = await Promise.all(uploads);

    if (type === "image") {
      setReturnImages((prev) => [...prev, ...urls].slice(0, 5)); // giới hạn 5 ảnh
    } else if (type === "video") {
      setReturnVideo(urls[0]); // chỉ 1 video
    }

    toast.success("Upload thành công!");

  } catch (err) {
    toast.error("Upload thất bại!");

  } finally {
    setUploading(false);
    setUploadProgress(0);
  }
};

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-gray-600">Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Bạn chưa có đơn hàng nào</h3>
        <p className="mt-1 text-sm text-gray-500">Hãy bắt đầu mua sắm ngay thôi!</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b">Đơn hàng của tôi</h1>
        <div className="space-y-6">
          {paginatedOrders.map((order) => {
            const status = STATUS_CONFIG[order.productStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.default;
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden divide-y divide-gray-200">
                <div className="p-4 sm:p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">Mã đơn hàng: #{order.id}</h3>
                    {order.order_code && (
                      <p className="text-sm text-gray-600">Order Code: {order.order_code}</p>
                    )}
                    <p className="text-sm text-gray-500">Ngày đặt: {formatOrderDate(order.order_date)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.style}`}>
                    {status.text}
                  </span>
                </div>

                <div className="p-4 sm:p-5 divide-y divide-gray-100">
                  {renderOrderItems(order)}
                </div>

                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 gap-3 sm:gap-0">
                  <div className="font-semibold text-lg text-gray-900">
                    <span>Tổng tiền: </span>
                    <span>{formatPrice(order.total_price)}</span>
                  </div>
                  <div className="flex gap-3">
                    {order.productStatus === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200"
                      >
                        Hủy đơn
                      </button>
                    )}
                    {order.productStatus === 'delivered' && (
                      <button
                        onClick={() => setReturnOrder(order)}
                        className="px-4 py-2 text-sm font-medium text-yellow-600 bg-white border border-yellow-300 rounded-md hover:bg-yellow-500 hover:text-white transition-colors duration-200"
                      >
                        Hoàn đơn
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-900 transition-colors duration-200"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {orders.length > ITEMS_PER_PAGE && (
          <div className="mt-8">
            <ProductPagination
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={orders.length}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modal Chi tiết đơn hàng */}
      {selectedOrder && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
            <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng #{selectedOrder.id}</h2>
            <p className="text-sm text-gray-500 mb-4">Ngày đặt: {formatOrderDate(selectedOrder.order_date)}</p>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">Thông tin khách hàng</h3>
              <p>Họ tên: {selectedOrder.user?.full_name}</p>
              <p>Email: {selectedOrder.user?.email}</p>
              <p>SĐT: {selectedOrder.user?.phone_number}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">Thông tin giao hàng</h3>
              <p>Địa chỉ: {selectedOrder.shipping_address}</p>
              <p>Đơn vị vận chuyển: {selectedOrder.delivery?.name}</p>
              <p>Phí ship: {formatPrice(selectedOrder.delivery?.fee)}</p>
              <p>Thời gian dự kiến: {selectedOrder.delivery?.estimatedTime}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">Thanh toán</h3>
              <p>Phương thức: {selectedOrder.payment_type}</p>
              <p>Tổng tiền: {formatPrice(selectedOrder.total_price)}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Sản phẩm</h3>
              {renderOrderItems(selectedOrder)}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal Hoàn đơn hàng */}
      {returnOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setReturnOrder(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">
              Hoàn đơn #{returnOrder.id}
            </h2>

            {/* Grid 2 cột - responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột trái */}
              <div className="space-y-4">
                {/* Lý do */}
                <div>
                  <label className="block font-medium mb-1">Lý do hoàn hàng</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                  >
                    <option value="">-- Chọn lý do --</option>
                    <option value="defective">Sản phẩm bị lỗi</option>
                    <option value="missing">Thiếu sản phẩm</option>
                    <option value="wrong">Giao sai sản phẩm</option>
                    <option value="other">Khác</option>
                  </select>
                  {errors.reason && (
                    <p className="text-sm text-red-500 mt-1">{errors.reason}</p>
                  )}
                </div>

                {/* Nếu chọn Khác */}
                {returnReason === "other" && (
                  <div>
                    <label className="block font-medium mb-1">Nhập lý do chi tiết</label>
                    <textarea
                      rows={3}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Nhập lý do khác..."
                      value={returnMessage}
                      onChange={(e) => setReturnMessage(e.target.value)}
                    ></textarea>
                    {errors.message && (
                      <p className="text-sm text-red-500 mt-1">{errors.message}</p>
                    )}
                  </div>
                )}

                {/* Chọn ngân hàng */}
                <div>
                  <label className="block font-medium mb-1">Chọn ngân hàng</label>
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between border rounded px-3 py-2"
                      onClick={() => setShowBankList(!showBankList)}
                    >
                      {selectedBank ? (
                        <span className="flex items-center gap-2">
                          <img src={selectedBank.logo} alt={selectedBank.name} className="w-6 h-6" />
                          {selectedBank.name}
                        </span>
                      ) : (
                        <span className="text-gray-500">-- Chọn ngân hàng --</span>
                      )}
                    </button>
                    {showBankList && (
                      <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border bg-white shadow">
                        {listBank.map((bank) => (
                          <li
                            key={bank.id}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedBank(bank);
                              setShowBankList(false);
                            }}
                          >
                            <img src={bank.logo} alt={bank.name} className="w-6 h-6" />
                            {bank.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {errors.bank && <p className="text-sm text-red-500 mt-1">{errors.bank}</p>}
                </div>

                {/* Nhập số tài khoản */}
                <div>
                  <label className="block font-medium mb-1">Nhập số tài khoản</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Nhập số tài khoản"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                  {errors.account && (
                    <p className="text-sm text-red-500 mt-1">{errors.account}</p>
                  )}
                </div>
              </div>

              {/* Cột phải */}
              <div className="space-y-4">
                {/* Upload video */}
                <div>
                  <label className="block font-medium mb-1">Upload Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    className="w-full"
                    onChange={(e) => e.target.files && handleUploadToCloudinary(e.target.files, "video")}
                  />
                  {uploading && <p className="text-sm text-blue-600 mt-1">Đang upload... {uploadProgress}%</p>}
                  {/* Preview video */}
                  {returnVideo && (
                    <div className="relative mt-2">
                      <video src={returnVideo} controls className="w-full rounded-md max-h-60" />
                      <button
                        onClick={() => setReturnVideo(null)}
                        className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                      >
                        X
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload hình ảnh */}
                <div>
                  <label className="block font-medium mb-1">Upload Hình ảnh (tối đa 5)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="w-full"
                    onChange={(e) => e.target.files && handleUploadToCloudinary(e.target.files, "image")}
                  />
                  {uploading && <p className="text-sm text-blue-600 mt-1">Đang upload... {uploadProgress}%</p>}

                  {/* Preview hình ảnh */}
                  {returnImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {returnImages.map((url, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={url}
                            alt={`preview-${idx}`}
                            className="w-24 h-24 object-cover rounded-md border"
                          />
                          <button
                            onClick={() =>
                              setReturnImages((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setReturnOrder(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Đóng
              </button>
              <button
                onClick={handleSubmitReturn}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Gửi yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}