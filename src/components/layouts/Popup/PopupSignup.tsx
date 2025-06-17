import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type PopUpProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PopupSignup({ isOpen, onClose }: PopUpProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Delay để cho phép animation play
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Delay 500ms để animation chạy xong rồi mới gỡ DOM
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
        {/* Nút đóng */}
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
          {/* Form bên trái */}
          <div className="bg-black text-white p-6 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-2">SIGN UP</h2>
            <h2 className="text-2xl font-bold text-center mb-2">& GET 10% OFF</h2>
            <p className="text-sm text-center mb-4">Applied to your first order</p>
            <input
              type="email"
              placeholder="Email"
              className="mb-3 px-3 py-2 rounded w-full text-black"
            />
            <input
              type="tel"
              placeholder="Phone number"
              className="mb-3 px-3 py-2 rounded w-full text-black"
            />
            <button className="bg-[#D2AE7E] text-black font-semibold py-2 rounded w-full">
              Join
            </button>
            <button
              onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 500);
            }}

              className="text-sm mt-2 underline text-center"
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
