'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type PopUpProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PopupSignup({ isOpen, onClose }: PopUpProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 500);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 500);
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-lg overflow-hidden shadow-lg w-[80%] max-w-md md:max-w-2xl relative transform transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 500);
          }}
          className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-black z-10"
        >
          ×
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Nội dung bên trái */}
          <div className="bg-black text-white p-6 flex flex-col justify-center items-center text-center">
            <h2 className="text-2xl font-bold mb-2">ĐĂNG KÝ</h2>
            <h2 className="text-2xl font-bold mb-2">& NHẬN 10% GIẢM GIÁ</h2>
            <p className="text-sm mb-6">Áp dụng cho đơn hàng đầu tiên của bạn</p>

            <button
              onClick={() => router.push('/signup')}
              className="bg-[#D2AE7E] text-black font-semibold py-2 px-6 rounded"
            >
              THAM GIA NGAY
            </button>

            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 500);
              }}
              className="text-sm mt-3 underline"
            >
              No, thanks
            </button>
          </div>

          {/* Ảnh bên phải */}
          <div className="hidden md:block relative min-h-[400px]">
            <Image
              src="/images/popup.jpg"
              alt="Popup"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
