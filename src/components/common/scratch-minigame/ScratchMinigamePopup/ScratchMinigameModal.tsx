import React, { useEffect, useRef, useState } from "react";
import { apiClient } from "@/app/api/apiClient";
import { useAuthStore } from "@/app/stores/slice/useAuthStore";
import TicketCountBadge from "../TicketCountBadge";
import TicketEarningActions from "../TicketEarningActions";
import ScratchCardArea from "./ScratchCardArea";
import toast from "react-hot-toast";

const CARD_WIDTH = 320;
const CARD_HEIGHT = 200;
const SCRATCH_RADIUS = 18;
const SCRATCH_THRESHOLD = 0.5;

type MilestoneCoupon = {
  code: string;
  discountPercent: number;
  milestonePoints: number;
  status?: string;
};

type ScratchResult = {
  grid: string[][];
  tileTokens: string[][];
  winLines: Array<{type: 'row' | 'col' | 'diag'; index: number}>;
  bonus: number;
  gridScore: number;
  totalPoints: number;
  tickets: number;
  couponGranted: boolean;
  couponCode: string | null;
  message: string;
  userPoints?: number;
  reward?: {
    type: string;
    value: number;
    description: string;
  };
};

type TicketEarningType = "post" | "product" | "social";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getUsageFromStorage(): Record<TicketEarningType, boolean> {
  const today = getTodayKey();
  const stored = localStorage.getItem("ticketEarnUsage");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        return parsed.usage;
      }
    } catch {}
  }
  localStorage.setItem(
    "ticketEarnUsage",
    JSON.stringify({ date: today, usage: { post: false, product: false, social: false } })
  );
  return { post: false, product: false, social: false };
}

function setUsageToStorage(usage: Record<TicketEarningType, boolean>) {
  localStorage.setItem(
    "ticketEarnUsage",
    JSON.stringify({ date: getTodayKey(), usage })
  );
}

export default function ScratchMinigameModal({ onClose }: { onClose: () => void }) {
  const [scratching, setScratching] = useState(false);
  const [scratched, setScratched] = useState(false);
  const [result, setResult] = useState<ScratchResult | null>(null);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tickets, setTickets] = useState<number>(0);
  const [earnLoading, setEarnLoading] = useState<TicketEarningType | null>(null);
  const [earnMsg, setEarnMsg] = useState<Record<TicketEarningType, string>>({
    post: "",
    product: "",
    social: "",
  });
  const [usedToday, setUsedToday] = useState<Record<TicketEarningType, boolean>>({
    post: false,
    product: false,
    social: false,
  });
  const [milestoneCoupons, setMilestoneCoupons] = useState<MilestoneCoupon[]>([]);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null) as React.MutableRefObject<HTMLCanvasElement | null>;
  const { isAuthenticated } = useAuthStore();
  const [displayedUserPoints, setDisplayedUserPoints] = useState<number>(0);
  const [initialUserPoints, setInitialUserPoints] = useState<number>(0);

  useEffect(() => {
    // Prevent background scrolling when the modal is open
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when the modal is closed
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []); // Empty dependency array means this effect runs only on mount and unmount


  useEffect(() => {
    setUsedToday(getUsageFromStorage());
  }, []);

  // Fetch user's current points when modal opens
  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const res = await apiClient.get<{ userPoints: number }>("/minigame/user-points");
        const points = res.data?.userPoints ?? 0;
        setInitialUserPoints(points);
        setDisplayedUserPoints(points);
      } catch {
        setInitialUserPoints(0);
        setDisplayedUserPoints(0);
      }
    };
    fetchUserPoints();
  }, []);

  // When a new game starts, keep the previous points until scratch is done
  useEffect(() => {
    if (!playing) {
      setDisplayedUserPoints(initialUserPoints);
    }
  }, [playing, initialUserPoints]);

  // When scratch is completed, update the displayed points
  useEffect(() => {
    if (scratched && result?.userPoints !== undefined) {
      setDisplayedUserPoints(result.userPoints);
    }
  }, [scratched, result?.userPoints]);

  // Handle error state updates
  const handleSetError = (error: Error | string | null) => {
    if (error === null) {
      setError(null);
    } else if (typeof error === 'string') {
      setError(new Error(error));
    } else {
      setError(error);
    }
  };

  // Fetch ticket count
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ tickets: number }>("/minigame/ticket-count");
      setTickets(res.data?.tickets ?? 0);
    } catch {
      setTickets(0);
    } finally {
      setLoading(false);
    }
  };

  // Use ticket and get game data
  const ticketToPlay = async () => {
    setLoading(true);
    setError(null);
    setScratched(false);
    setScratchedPercent(0);
    setResult(null);
    setPlaying(false);
    setDisplayedUserPoints(result?.userPoints ?? displayedUserPoints);
    try {
      const res = await apiClient.post<ScratchResult>("/minigame/play-scratch", {});
      if (!res.success) throw new Error(res.error || "Không thể kết nối minigame backend");
      setResult(res.data!);
      setTickets(res.data!.tickets);
      setPlaying(true);
      setTimeout(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, 500, 360);
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = "#e5e7eb";
          ctx.fillRect(0, 0, 500, 360);
        }
      }, 50);
    } catch (err) {
      const error = err as Error;
      handleSetError(error.message || "Có lỗi xảy ra khi kết nối minigame backend.");
      setTickets(0);
    } finally {
      setLoading(false);
    }
  };

  // Earn ticket by simulating an action
  const earnTicket = async (type: TicketEarningType) => {
    setEarnLoading(type);
    setEarnMsg((prev) => ({ ...prev, [type]: "" }));
    try {
      if (!isAuthenticated || usedToday[type]) {
        setEarnLoading(null);
        return;
      }
      const refId = Math.random().toString(36).slice(2, 10);
      const res = await apiClient.post<{ message: string; tickets: number }>(
        "/minigame/earn-ticket",
        { type, refId }
      );
      // Only update if backend confirms ticket was earned
      if (
        res.data?.message?.toLowerCase().includes("đã nhận vé này hôm nay") ||
        res.data?.message?.toLowerCase().includes("already earned ticket")
      ) {
        setEarnMsg((prev) => ({ ...prev, [type]: res.data?.message }));
        toast.error(res.data?.message || "Bạn đã nhận vé này hôm nay rồi.");
        // Do NOT update local usage or ticket count
      } else if (
        res.data?.message?.toLowerCase().includes("đã nhận vé") ||
        res.data?.message?.toLowerCase().includes("ticket earned")
      ) {
        setEarnMsg((prev) => ({ ...prev, [type]: res.data?.message }));
        await fetchTickets();
        const newUsage = { ...usedToday, [type]: true };
        setUsedToday(newUsage);
        setUsageToStorage(newUsage);
        toast.success("Đã nhận vé!");
      } else {
        setEarnMsg((prev) => ({ ...prev, [type]: res.data?.message }));
        toast.error(res.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (err) {
      const error = err as Error;
      setEarnMsg((prev) => ({ ...prev, [type]: error.message || "Không thể nhận vé." }));
    } finally {
      setEarnLoading(null);
    }
  };


  // Fetch milestone coupons on mount
  useEffect(() => {
    const fetchMilestones = async () => {
      const res = await apiClient.get<{ coupons: MilestoneCoupon[] }>("/coupons/milestone-coupons");
      // Filter for only active coupons (defensive, backend should already do this)
      const activeCoupons = (res.data?.coupons ?? []).filter(c => !c.status || c.status === "active");
      setMilestoneCoupons(activeCoupons);
    };
    fetchMilestones();
  }, []);

  // Fetch next coupon code when userPoints changes
  useEffect(() => {
    const fetchNextCoupon = async () => {
      if (result?.userPoints && result.userPoints > 0) {
        const res = await apiClient.get<{ coupon: { code: string; discount: number; status?: string } | null }>(
          `/coupons/next-milestone-coupon?userPoints=${result.userPoints}`
        );
        // Defensive: only set if coupon is active
        if (res.data?.coupon && (!res.data.coupon.status || res.data.coupon.status === "active")) {
          // No need to set nextCoupon since it's not used
        }
      }
    };
    fetchNextCoupon();
  }, [result?.userPoints]);

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
  useEffect(() => {
    fetchTickets();
  }, []);

  // Use displayedUserPoints for display
  const userPoints = displayedUserPoints;
  const nextMilestone = milestoneCoupons.find((m) => userPoints < m.milestonePoints);

  // Helper to mask coupon code
  function maskCoupon(code: string) {
    if (!code) return "???";
    if (code.length <= 4) return "*".repeat(code.length);
    return "*".repeat(code.length - 4) + code.slice(-4);
  }

  // --- FIX 1: Revert background to original (no gradient, just semi-transparent black with blur) ---
  // --- FIX 2: Only check dailyClaimed status ONCE per day, using localStorage ---

  // Helper for daily claim localStorage
  function getDailyClaimedFromStorage(): boolean {
    const today = getTodayKey();
    const stored = localStorage.getItem("ticketDailyClaimed");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          return !!parsed.claimed;
        }
      } catch {}
    }
    // Not claimed today
    localStorage.setItem("ticketDailyClaimed", JSON.stringify({ date: today, claimed: false }));
    return false;
  }
  function setDailyClaimedToStorage(claimed: boolean) {
    localStorage.setItem("ticketDailyClaimed", JSON.stringify({ date: getTodayKey(), claimed }));
  }

  // On mount, check localStorage for dailyClaimed
  useEffect(() => {
    setDailyClaimed(getDailyClaimedFromStorage());
  }, []);

  // When dailyClaimed changes, update localStorage
  useEffect(() => {
    setDailyClaimedToStorage(dailyClaimed);
  }, [dailyClaimed]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-auto rounded-3xl shadow-2xl border-4 border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100 ring-8 ring-yellow-200/40 flex flex-col overflow-hidden">
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 rounded-t-3xl" />
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-yellow-500 hover:text-yellow-700 text-4xl z-10 bg-white/80 rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-2 border-yellow-200 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Close"
        >
          &times;
        </button>
        {/* Modal Content */}
        <div className="flex flex-col gap-6 px-6 pt-16 pb-10 max-h-[90vh] overflow-y-auto relative">
          <h2 className="text-5xl font-extrabold mb-2 text-center text-yellow-600 tracking-wide drop-shadow-lg">
            🎉 Scratch &amp; Win! 🎉
          </h2>
          {/* Player's current points and milestones */}
          <div className="flex flex-col items-center mb-2">
            <span className="text-lg font-bold text-blue-700 drop-shadow">
              Điểm của bạn: <span className="text-2xl">{displayedUserPoints}</span>
            </span>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {milestoneCoupons.map(m => {
                const reached = displayedUserPoints >= m.milestonePoints;
                return (
                  <span
                    key={`${m.code}-${m.milestonePoints}`}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow transition border
                      ${reached
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                      }
                    `}
                  >
                    🎁 Coupon:{" "}
                    <span className="underline">
                      {reached ? m.code : maskCoupon(m.code)}
                    </span>{" "}
                    <span className="text-gray-600">({m.discountPercent}%)</span>
                    <span className="ml-1">- {m.milestonePoints} điểm</span>
                    {!reached && nextMilestone?.milestonePoints === m.milestonePoints && (
                      <span className="ml-2 text-yellow-600 font-bold animate-pulse">
                        (Còn {m.milestonePoints - displayedUserPoints} điểm)
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
          <TicketCountBadge tickets={tickets} />
          {!playing && (
            <>
              {/* Earning Actions Section */}
              <div className="flex flex-col gap-2 items-center mb-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-inner w-full max-w-md flex flex-col gap-2">
                  <TicketEarningActions
                    isAuthenticated={isAuthenticated}
                    earnLoading={earnLoading}
                    earnMsg={earnMsg}
                    onEarn={earnTicket}
                  />
                </div>
              </div>
              {/* Play Button */}
              <div className="mt-3 flex justify-center">
                <button
                  className={`bg-gradient-to-br from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-black px-8 py-3 rounded-full shadow-xl font-extrabold text-xl transition border-2 border-yellow-200 hover:scale-105
                    ${loading || playing || !isAuthenticated || !tickets || tickets < 1 ? "opacity-60 pointer-events-none" : ""}
                  `}
                  onClick={async () => {
                    if (!loading && !playing && isAuthenticated && tickets && tickets > 0) {
                      await ticketToPlay();
                    }
                  }}
                  disabled={loading || playing || !isAuthenticated || !tickets || tickets < 1}
                  tabIndex={0}
                >
                  {loading
                    ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Đang tải...
                      </span>
                    )
                    : !isAuthenticated
                    ? "Đăng nhập để chơi"
                    : tickets && tickets > 0
                    ? "Dùng 1 vé để chơi"
                    : "Hết vé"}
                </button>
              </div>
            </>
          )}
          {playing && (
            <ScratchCardArea
              canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
              scratching={scratching}
              setScratching={setScratching}
              scratched={scratched}
              setScratched={setScratched}
              scratchedPercent={scratchedPercent}
              loading={loading}
              error={error}
              result={result}
              handleScratch={handleScratch}
              onPlayAgain={ticketToPlay}
              tickets={tickets}
            />
          )}
        </div>
        {/* Decorative Bottom Bar */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 rounded-b-3xl" />
      </div>
    </div>
  );
}