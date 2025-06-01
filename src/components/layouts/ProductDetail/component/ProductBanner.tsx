"use client";

import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ProductBanner() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative w-full h-[400px] sm:h-[500px] md:h-[700px] lg:h-[900px] bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url('/Banner_GoD_4000x2000_min.webp')",
      }}
    >
      {/* Nút hotspot + */}
      <button
        onClick={() => setOpen(true)}
        className="absolute 
          top-[35%] left-[10%] 
          sm:top-[38%] sm:left-[12%] 
          md:top-[40%] md:left-[12%] 
          w-10 h-10 sm:w-12 sm:h-12 
          rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 
          border border-gray-300 flex items-center justify-center 
          text-black text-xl sm:text-2xl font-bold shadow-md transition-all duration-200"
      >
        +
      </button>

      {/* Popup info */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <Dialog.Panel
            as={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white max-w-md w-full rounded-xl p-6 shadow-2xl"
          >
            <Dialog.Title className="text-xl font-bold mb-2">
              Card Game
            </Dialog.Title>
            <Dialog.Description className="text-gray-600 mb-4">
              Một bộ bài siêu thú vị để bạn chill cùng bạn bè!
            </Dialog.Description>
            <button
              onClick={() => setOpen(false)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Đóng
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
