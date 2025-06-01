import { useState } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";

const hotspots = [
  {
    id: 1,
    title: "Hộp gỗ đựng Mahjong",
    description: "Sản phẩm thủ công cao cấp, đựng bộ bài Mahjong sang trọng.",
    style: { top: "40%", left: "15%" },
  },
  {
    id: 2,
    title: "Bộ Poker gỗ",
    description: "Poker set cao cấp với chips màu và vỏ hộp gỗ sồi bóng.",
    style: { top: "35%", left: "35%" },
  },
  {
    id: 3,
    title: "Cờ vua gỗ",
    description: "Bộ cờ vua truyền thống được chế tác từ gỗ óc chó.",
    style: { top: "70%", left: "75%" },
  },
  {
    id: 4,
    title: "Cờ vây cổ điển",
    description: "Mặt bàn gỗ + quân cờ đen trắng đặc trưng của Nhật Bản.",
    style: { top: "65%", left: "30%" },
  },
];

export default function SignatureBanner() {
  type Hotspot = {
    id: number;
    title: string;
    description: string;
    style: {
      top: string;
      left: string;
    };
  };

  const [selected, setSelected] = useState<Hotspot | null>(null);

  return (
    <div className="relative w-full h-auto">
      <Image
        src="/sig_coll_desk.png"
        alt="BST Signature"
        width={1920}
        height={768}
        className="w-full h-auto object-cover"
        priority
      />

      {hotspots.map((spot) => (
        <button
          key={spot.id}
          onClick={() => setSelected(spot)}
          className="absolute w-10 h-10 bg-white border border-gray-400 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
          style={spot.style} // <-- Move/adjust button positions here
        >
          +
        </button>
      ))}

      <Dialog open={!!selected} onClose={() => setSelected(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            className="bg-white p-6 rounded-xl max-w-sm w-full shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Dialog.Title className="text-xl font-semibold mb-2">
              {selected?.title}
            </Dialog.Title>
            <p className="text-gray-700 mb-4">{selected?.description}</p>
            <button
              onClick={() => alert("Chức năng đặt hàng đang phát triển 😄")}
              className="bg-brown-700 text-white px-4 py-2 rounded hover:bg-brown-800 transition"
            >
              Đặt hàng
            </button>
          </motion.div>
        </div>
      </Dialog>
    </div>
  );
}
