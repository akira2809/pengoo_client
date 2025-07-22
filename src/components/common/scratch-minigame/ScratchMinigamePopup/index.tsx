import { useState } from "react";
import Image from "next/image";
import ScratchMinigameModal from "./ScratchMinigameModal";

export default function ScratchMinigamePopup({
  buttonImage,
}: {
  buttonImage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const handleOpen = () => {
    setModalKey((k) => k + 1); // force remount
    setOpen(true);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-40 right-8 z-[100] bg-gradient-to-br from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-black rounded-full shadow-2xl border-4 border-yellow-200 p-6 flex items-center justify-center transition-all animate-bounce ring-4 ring-yellow-300/40"
        aria-label="Open Scratch Minigame"
      >
        {buttonImage ? (
          <Image
            src={buttonImage}
            alt="Minigame"
            width={56}
            height={56}
            className="w-14 h-14 object-contain drop-shadow-lg"
            unoptimized={true}
            priority
            loading="eager"
            draggable={false}
            style={{ pointerEvents: "none" }}
            sizes="(max-width: 640px) 56px, 56px"
          />
        ) : (
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#fff" />
            <path
              d="M8 12h8M12 8v8"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
      {open && <ScratchMinigameModal key={modalKey} onClose={() => setOpen(false)} />}
    </>
  );
}