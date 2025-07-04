export default function DailyTicketButton({
  isAuthenticated,
  claimLoading,
  claimMsg,
  onClaim,
}: {
  isAuthenticated: boolean;
  claimLoading: boolean;
  claimMsg: string | null;
  onClaim: () => void;
}) {
  return (
    <div className="flex items-center gap-2 justify-center mt-2">
      <button
        className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded shadow text-xs font-semibold hover:bg-yellow-300 transition"
        disabled={claimLoading || !isAuthenticated}
        onClick={onClaim}
      >
        {claimLoading ? "Đang nhận vé miễn phí..." : "Nhận vé miễn phí hôm nay"}
      </button>
      <span className="text-xs text-gray-600">+1 vé/ngày</span>
      {claimMsg && (
        <span className="ml-2 text-xs text-green-700">{claimMsg}</span>
      )}
    </div>
  );
}