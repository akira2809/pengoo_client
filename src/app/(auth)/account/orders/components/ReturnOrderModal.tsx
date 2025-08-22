'use client';

import { OrderWithUser, IBank } from '@/app/type/order';
import { useState, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ReturnOrderModalProps {
  order: OrderWithUser | null;
  onClose: () => void;
  listBank: IBank[];
  onSubmitReturn: (data: {
    orderId: number;
    reason: string;
    message: string;
    bank: IBank | null;
    accountNumber: string;
    video: string | null;
    images: string[];
  }) => void;
}

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "diishpkrl";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_unsigned_preset";

export function ReturnOrderModal({ order, onClose, listBank, onSubmitReturn }: ReturnOrderModalProps) {
  const [returnReason, setReturnReason] = useState('');
  const [returnMessage, setReturnMessage] = useState('');
  const [selectedBank, setSelectedBank] = useState<IBank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [showBankList, setShowBankList] = useState(false);
  const [returnVideo, setReturnVideo] = useState<string | null>(null);
  const [returnImages, setReturnImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [returnOrder, setReturnOrder] = useState<OrderWithUser | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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
          formData.append("folder", "returns");

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
      console.error(err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      
      // Reset input values
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (returnImages.length + files.length > 5) {
      toast.error("Bạn chỉ được upload tối đa 5 hình ảnh");
      return;
    }

    handleUploadToCloudinary(files, "image");
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (returnVideo) {
      toast.error("Chỉ được upload 1 video");
      return;
    }

    handleUploadToCloudinary(files, "video");
  };

  const removeImage = (index: number) => {
    setReturnImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setReturnVideo(null);
  };

  const handleSubmit = () => {
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
    } else if (!/^\d{6,16}$/.test(accountNumber.trim())) {
      newErrors.account = 'Số tài khoản phải từ 6 đến 16 chữ số';
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

    if (!order) return;

    // Gửi formdata
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

    console.log('FormData gửi đi:', { 
      reason: returnReason, 
      message: returnMessage, 
      bank: selectedBank, 
      accountNumber,
      video: returnVideo,
      images: returnImages
    });

    // Gọi hàm submit từ props
    onSubmitReturn({
      orderId: order.id,
      reason: returnReason,
      message: returnMessage,
      bank: selectedBank,
      accountNumber,
      video: returnVideo,
      images: returnImages
    });

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

  if (!order) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">
          Hoàn đơn #{order.id}
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
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="w-full"
                onChange={handleVideoUpload}
                disabled={uploading || !!returnVideo}
              />
              {uploading && <p className="text-sm text-blue-600 mt-1">Đang upload... {uploadProgress}%</p>}
              
              {/* Preview video */}
              {returnVideo && (
                <div className="relative mt-2">
                  <video src={returnVideo} controls className="w-full rounded-md max-h-60" />
                  <button
                    onClick={removeVideo}
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
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="w-full"
                onChange={handleImageUpload}
                disabled={uploading || returnImages.length >= 5}
              />
              {uploading && <p className="text-sm text-blue-600 mt-1">Đang upload... {uploadProgress}%</p>}

              <p className="text-sm text-gray-500 mt-1">
                Đã upload: {returnImages.length}/5 hình ảnh
              </p>

              {/* Preview hình ảnh */}
              {returnImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {returnImages.map((url, idx) => (
                    <div key={idx} className="relative">
                      <Image
                        src={url}
                        alt={`preview-${idx}`}
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                      <button
                        onClick={() => removeImage(idx)}
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
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Đóng
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
          >
            {uploading ? 'Đang upload...' : 'Gửi yêu cầu'}
          </button>
        </div>
      </div>
    </div>
  );
}