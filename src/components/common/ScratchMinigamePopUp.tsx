"use client";
import { useRef, useState } from "react";
import { apiClient } from "@/app/api/apiClient";
import { useAuthStore } from "@/app/stores/slice/useAuthStore";
import TicketCountBadge from "./scratch-minigame/TicketCountBadge";
import TicketEarningActions from "./scratch-minigame/TicketEarningActions";
import DailyTicketButton from "./scratch-minigame/DailyTicketButton";
import ScratchRewardInfo from "./scratch-minigame/ScratchRewardInfo";
import ScratchCanvas from "./scratch-minigame/ScratchCanvas";

const CARD_WIDTH = 320;
const CARD_HEIGHT = 200;
const SCRATCH_RADIUS = 18;
const SCRATCH_THRESHOLD = 0.5;

type ScratchResult = {
  grid: string[][];
  tileTokens: string[][];
  winLines: string[];
  bonus: number;
  gridScore: number;
  totalPoints: number;
  tickets: number;
  couponGranted: boolean;
  couponCode: string | null;
  message: string;
};

type TicketEarningType = "post" | "product" | "social";

export default function ScratchMinigamePopup() {
  const [open, setOpen] = useState(false);
  const [scratching, setScratching] = useState(false);
  const [scratched, setScratched] = useState(false);
  const [result, setResult] = useState<ScratchResult | null>(null);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<number | null>(null);
  const [earnLoading, setEarnLoading] = useState<TicketEarningType | null>(null);
  const [earnMsg, setEarnMsg] = useState<Record<TicketEarningType, string>>({
    post: "",
    product: "",
    social: "",
  });
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimMsg, setClaimMsg] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isAuthenticated } = useAuthStore();

  // Fetch ticket count (from last minigame result or by playing scratch)
  const fetchTickets = async () => {
    if (result) {
      setTickets(result.tickets);
      return;
    }
    try {
      const res = await apiClient.post<ScratchResult>("/minigame/play-scratch", {});
      if (res.data?.tickets !== undefined) setTickets(res.data.tickets);
    } catch {
      setTickets(0);
    }
  };

  // Call backend to play the minigame
  const startGame = async () => {
    setResult(null);
    setScratched(false);
    setScratchedPercent(0);
    setError(null);
    setOpen(true);
    setLoading(true);

    try {
      const res = await apiClient.post<ScratchResult>(
        "/minigame/play-scratch",
        {}
      );
      if (!res.success) throw new Error(res.error || "Không thể kết nối minigame backend");
      setResult(res.data!);
      setTickets(res.data!.tickets);
    } catch (err) {
      const error = err as Error;
      setError(
        error.message ||
          "Có lỗi xảy ra khi kết nối minigame backend."
      );
      setTickets(0);
    } finally {
      setLoading(false);
      setTimeout(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = "#e5e7eb";
          ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
        }
      }, 50);
    }
  };

  // Earn ticket by simulating an action
  const earnTicket = async (type: TicketEarningType) => {
    setEarnLoading(type);
    setEarnMsg((prev) => ({ ...prev, [type]: "" }));
    try {
      if (!isAuthenticated) {
        setEarnMsg((prev) => ({ ...prev, [type]: "Bạn cần đăng nhập để nhận vé." }));
        setEarnLoading(null);
        return;
      }
      const refId = Math.random().toString(36).slice(2, 10);
      const res = await apiClient.post<{ message: string; tickets: number }>(
        "/minigame/earn-ticket",
        { type, refId }
      );
      setEarnMsg((prev) => ({ ...prev, [type]: res.data?.message || "Đã nhận vé!" }));
      setTickets(res.data?.tickets ?? tickets);
    } catch (err) {
      const error = err as Error;
      setEarnMsg((prev) => ({ ...prev, [type]: error.message || "Không thể nhận vé." }));
    } finally {
      setEarnLoading(null);
    }
  };

  // Claim daily ticket
  const claimDailyTicket = async () => {
    setClaimLoading(true);
    setClaimMsg(null);
    try {
      if (!isAuthenticated) {
        setClaimMsg("Bạn cần đăng nhập để nhận vé miễn phí.");
        setClaimLoading(false);
        return;
      }
      const res = await apiClient.post<{ message: string; tickets: number }>(
        "/minigame/claim-daily-ticket",
        {}
      );
      setClaimMsg(res.data?.message || "Đã nhận vé miễn phí!");
      setTickets(res.data?.tickets ?? tickets);
    } catch (err) {
      const error = err as Error;
      setClaimMsg(error.message || "Không thể nhận vé miễn phí.");
    } finally {
      setClaimLoading(false);
    }
  };

  // Handle scratching
  const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (scratched || loading || error) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x: number, y: number;
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

  // Show ticket count on open
  const handleOpen = () => {
    setOpen(true);
    fetchTickets();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-black rounded-full shadow-xl p-4 flex items-center justify-center transition-all"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-6 border border-yellow-100">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-extrabold mb-2 text-center text-yellow-600 tracking-wide drop-shadow">
              🎉 Scratch &amp; Win! 🎉
            </h2>
            <TicketCountBadge tickets={tickets} />
            {tickets === 0 && (
              <div className="mb-4 text-center">
                <div className="text-sm text-gray-700 mb-2">
                  Bạn đã hết vé. Hãy thực hiện các hành động sau để nhận thêm vé:
                </div>
                <TicketEarningActions
                  isAuthenticated={isAuthenticated}
                  earnLoading={earnLoading}
                  earnMsg={earnMsg}
                  onEarn={earnTicket}
                />
                <DailyTicketButton
                  isAuthenticated={isAuthenticated}
                  claimLoading={claimLoading}
                  claimMsg={claimMsg}
                  onClaim={claimDailyTicket}
                />
                {!isAuthenticated && (
                  <div className="mt-2 text-xs text-red-600">
                    Vui lòng đăng nhập để nhận vé minigame.
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-col items-center">
              <div
                className="relative"
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-200 rounded-xl border-2 border-yellow-300 text-2xl font-bold select-none shadow-inner">
                  {loading ? (
                    <span className="text-base text-gray-400">
                      Đang tải phần thưởng...
                    </span>
                  ) : error ? (
                    <span className="text-base text-red-500">{error}</span>
                  ) : result ? (
                    <ScratchRewardInfo result={result} />
                  ) : (
                    <span className="text-base text-gray-500">
                      Cào thẻ để nhận phần thưởng!
                    </span>
                  )}
                </div>
                <ScratchCanvas
                  canvasRef={canvasRef}
                  onScratch={handleScratch}
                  scratching={scratching}
                  setScratching={setScratching}
                  disabled={scratched || loading || !!error || tickets === 0}
                />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl z-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                {scratched && !loading && !error ? (
                  <button
                    className="bg-gradient-to-br from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-black px-5 py-2 rounded-full shadow font-semibold transition"
                    onClick={startGame}
                  >
                    Chơi lại
                  </button>
                ) : (
                  !loading &&
                  !error && tickets !== 0 && (
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