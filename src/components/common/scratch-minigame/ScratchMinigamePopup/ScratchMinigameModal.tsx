import React, { useEffect, useRef, useState } from "react";
import { apiClient } from "@/app/api/apiClient";
import { useAuthStore } from "@/app/stores/slice/useAuthStore";
import TicketCountBadge from "../TicketCountBadge";
import ScratchPlayActions from "./ScratchPlayActions";
import ScratchCardArea from "./ScratchCardArea";

const CARD_WIDTH = 320;
const CARD_HEIGHT = 200;
const SCRATCH_RADIUS = 18;
const SCRATCH_THRESHOLD = 0.5;

type MilestoneCoupon = {
  code: string;
  discountPercent: number;
  milestonePoints: number;
  status?: string; // In case backend returns status
};

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
  userPoints?: number;
};

type TicketEarningType = "post" | "product" | "social";

export default function ScratchMinigameModal({ onClose }: { onClose: () => void }) {
  const [scratching, setScratching] = useState(false);
  const [scratched, setScratched] = useState(false);
  const [result, setResult] = useState<ScratchResult | null>(null);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
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
  const [milestoneCoupons, setMilestoneCoupons] = useState<MilestoneCoupon[]>([]);
  const [nextCoupon, setNextCoupon] = useState<{ code: string; discount: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isAuthenticated } = useAuthStore();
  const [displayedUserPoints, setDisplayedUserPoints] = useState<number>(0);
  const [initialUserPoints, setInitialUserPoints] = useState<number>(0);

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

  // Fetch ticket count
  const fetchTickets = async () => {
    try {
      const res = await apiClient.post<ScratchResult>("/minigame/play-scratch", {});
      if (res.data?.tickets !== undefined) setTickets(res.data.tickets);
    } catch {
      setTickets(0);
    }
  };

  // Use ticket and get game data
  const useTicketToPlay = async () => {
    setLoading(true);
    setError(null);
    setScratched(false);
    setScratchedPercent(0);
    setResult(null);
    setPlaying(false);
    try {
      const res = await apiClient.post<ScratchResult>("/minigame/play-scratch", {});
      if (!res.success) throw new Error(res.error || "Không thể kết nối minigame backend");
      setResult(res.data!);
      setTickets(res.data!.tickets);
      setPlaying(true);
      setTimeout(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, 500, 360); // Use the same width/height as above
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = "#e5e7eb"; // Overlay color
          ctx.fillRect(0, 0, 500, 360);
        }
      }, 50);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Có lỗi xảy ra khi kết nối minigame backend.");
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
        const res = await apiClient.get<{ coupon: { code: string; discount: number } | null }>(
          `/coupons/next-milestone-coupon?userPoints=${result.userPoints}`
        );
        // Defensive: only set if coupon is active
        if (res.data?.coupon && (!res.data.coupon.status || res.data.coupon.status === "active")) {
          setNextCoupon(res.data.coupon);
        } else {
          setNextCoupon(null);
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
  useState(() => {
    fetchTickets();
  });

  // Use displayedUserPoints for display
  const userPoints = displayedUserPoints;
  const nextMilestone = milestoneCoupons.find((m) => userPoints < m.milestonePoints);

  // Helper to mask coupon code
  function maskCoupon(code: string) {
    if (!code) return "???";
    if (code.length <= 4) return "*".repeat(code.length);
    return "*".repeat(code.length - 4) + code.slice(-4);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl shadow-2xl w-full max-w-3xl relative p-0 border-4 border-yellow-300 flex flex-col ring-8 ring-yellow-200/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-yellow-500 hover:text-yellow-700 text-4xl z-10 bg-white/80 rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-2 border-yellow-200"
          aria-label="Close"
        >
          &times;
        </button>
        {/* Modal Content */}
        <div className="flex flex-col gap-4 px-12 pt-12 pb-10 max-h-[90vh] overflow-y-auto">
          <h2 className="text-5xl font-extrabold mb-4 text-center text-yellow-600 tracking-wide drop-shadow-lg">
            🎉 Scratch &amp; Win! 🎉
          </h2>
          {/* Player's current points and milestones */}
          <div className="flex flex-col items-center mb-2">
            <span className="text-lg font-bold text-blue-700">
              Điểm của bạn: {userPoints}
            </span>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {milestoneCoupons.map(m => {
                const reached = userPoints >= m.milestonePoints;
                return (
                  <span
                    key={m.milestonePoints}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow
                      ${reached
                        ? "bg-green-200 text-green-700 border border-green-400"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                      }
                    `}
                  >
                    🎁 Coupon:{" "}
                    <span className="underline">
                      {reached ? m.code : maskCoupon(m.code)}
                    </span>{" "}
                    ({m.discountPercent}%)
                    <span className="ml-1">- {m.milestonePoints} điểm</span>
                    {!reached && nextMilestone?.milestonePoints === m.milestonePoints && (
                      <span className="ml-2 text-yellow-600 font-bold">
                        (Còn {m.milestonePoints - userPoints} điểm)
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
          <TicketCountBadge tickets={tickets} />
          {!playing && (
            <ScratchPlayActions
              tickets={tickets}
              isAuthenticated={isAuthenticated}
              earnLoading={earnLoading}
              earnMsg={earnMsg}
              onEarn={earnTicket}
              claimLoading={claimLoading}
              claimMsg={claimMsg}
              onClaim={claimDailyTicket}
              onPlay={useTicketToPlay}
              loading={loading}
              playing={playing}
            />
          )}
          {playing && (
            <ScratchCardArea
              canvasRef={canvasRef}
              scratching={scratching}
              setScratching={setScratching}
              scratched={scratched}
              setScratched={setScratched}
              scratchedPercent={scratchedPercent}
              setScratchedPercent={setScratchedPercent}
              loading={loading}
              error={error}
              result={result}
              handleScratch={handleScratch}
              useTicketToPlay={useTicketToPlay}
              tickets={tickets}
            />
          )}
        </div>
      </div>
    </div>
  );
}