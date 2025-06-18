"use client";
import { apiClient } from "@/app/api/apiClient";
import { useRef, useState } from "react";

const CARD_WIDTH = 300;
const CARD_HEIGHT = 180;
const SCRATCH_RADIUS = 18;
const SCRATCH_THRESHOLD = 0.5; // 50% scratched to reveal

export default function ScratchMinigamePopup() {
  const [open, setOpen] = useState(false);
  const [scratching, setScratching] = useState(false);
  const [scratched, setScratched] = useState(false);
  const [reward, setReward] = useState<{ label: string; value: string } | null>(
    null
  );
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Call backend to play the minigame
  const startGame = async () => {
    setReward(null);
    setScratched(false);
    setScratchedPercent(0);
    setError(null);
    setOpen(true);
    setLoading(true);

    try {
      // Only use the relative path here!
      const res = await apiClient.post<{ label: string; value: string }>(
        "/minigame/play-scratch"
      );
      setReward({
        label: res.data?.label || res.data?.value || "🎁 Unknown Reward",
        value: res.data?.value || "",
      });
    } catch (err: any) {
      setError(
        err.message ||
          "Có lỗi xảy ra khi kết nối minigame backend."
      );
    } finally {
      setLoading(false);
      setTimeout(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = "#bdbdbd";
          ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
        }
      }, 50);
    }
  };

  // Handle scratching
  const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (scratched || loading || error) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x, y;
    if ("touches" in e) {
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, SCRATCH_RADIUS, 0, 2 * Math.PI);
    ctx.fill();

    // Calculate scratched area
    const imageData = ctx.getImageData(0, 0, CARD_WIDTH, CARD_HEIGHT);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const percent = (transparent / (CARD_WIDTH * CARD_HEIGHT)) * 100;
    setScratchedPercent(percent);

    if (percent > SCRATCH_THRESHOLD * 100) {
      setScratched(true);
      setTimeout(() => {
        ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
      }, 300);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={startGame}
        className="fixed bottom-6 right-6 z-50 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full shadow-lg p-4 flex items-center justify-center transition-all"
        aria-label="Open Scratch Minigame"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#fff" />
          <path
            d="M8 12h8M12 8v8"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm relative p-6">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">
              Scratch &amp; Win!
            </h2>
            <div className="flex flex-col items-center">
              <div
                className="relative"
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
              >
                {/* Reward Card: Show grid if result exists */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-lg border-2 border-yellow-400 text-2xl font-bold select-none">
                  {loading ? (
                    <span className="text-base text-gray-400">
                      Đang tải phần thưởng...
                    </span>
                  ) : error ? (
                    <span className="text-base text-red-500">{error}</span>
                  ) : reward ? (
                    <div>
                      <div className="mb-2">
                        <span className="text-base font-semibold">
                          Tổng điểm: {reward.value}
                        </span>
                        <br />
                        <span className="text-base">Vé còn lại: 0</span>
                      </div>
                      <div className="text-green-700 font-semibold text-base">
                        {reward.label}
                      </div>
                    </div>
                  ) : (
                    <span className="text-base text-gray-500">
                      Cào thẻ để nhận phần thưởng!
                    </span>
                  )}
                </div>
                {/* Scratch Canvas */}
                {!scratched && !loading && !error && (
                  <canvas
                    ref={canvasRef}
                    width={CARD_WIDTH}
                    height={CARD_HEIGHT}
                    className="absolute inset-0 w-full h-full rounded-lg touch-none cursor-pointer"
                    style={{ zIndex: 2 }}
                    onMouseDown={() => setScratching(true)}
                    onMouseUp={() => setScratching(false)}
                    onMouseLeave={() => setScratching(false)}
                    onMouseMove={(e) => scratching && handleScratch(e)}
                    onTouchStart={() => setScratching(true)}
                    onTouchEnd={() => setScratching(false)}
                    onTouchCancel={() => setScratching(false)}
                    onTouchMove={(e) => scratching && handleScratch(e)}
                  />
                )}
                {/* Loading overlay */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg z-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                {scratched && !loading && !error ? (
                  <div>
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded shadow font-medium"
                      onClick={startGame}
                    >
                      Chơi lại
                    </button>
                  </div>
                ) : (
                  !loading &&
                  !error && (
                    <span className="text-gray-500 text-sm">
                      Cào thẻ để nhận phần thưởng!
                      <br />
                      {Math.round(scratchedPercent)}% đã cào
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}