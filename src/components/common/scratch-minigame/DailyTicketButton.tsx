import { useEffect, useState } from "react";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

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

export default function DailyTicketButton({
  isAuthenticated,
  claimLoading,
  claimMsg,
  onClaim,
  dailyClaimed,
}: {
  isAuthenticated: boolean;
  claimLoading: boolean;
  claimMsg: string | null;
  onClaim: () => void;
  dailyClaimed: boolean;
}) {
  const [claimedToday, setClaimedToday] = useState(false);

  // Sync with localStorage and prop
  useEffect(() => {
    setClaimedToday(getDailyClaimedFromStorage());
  }, []);

  useEffect(() => {
    setClaimedToday(dailyClaimed);
    setDailyClaimedToStorage(dailyClaimed);
  }, [dailyClaimed]);

  return (
    <div className="flex items-center gap-2 justify-center mt-2">
      <button
        className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded shadow text-xs font-semibold hover:bg-yellow-300 transition"
        disabled={claimLoading || !isAuthenticated || claimedToday}
        onClick={onClaim}
      >
        {claimLoading
          ? "Đang nhận vé miễn phí..."
          : claimedToday
          ? "Đã nhận vé hôm nay"
          : "Nhận vé miễn phí hôm nay"}
      </button>
      <span className="text-xs text-gray-600">+1 vé/ngày</span>
      {claimMsg && (
        <span className="ml-2 text-xs text-green-700">{claimMsg}</span>
      )}
    </div>
  );
}