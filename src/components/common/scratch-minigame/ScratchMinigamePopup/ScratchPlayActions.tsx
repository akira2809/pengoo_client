import TicketEarningActions from "../TicketEarningActions";
import DailyTicketButton from "../DailyTicketButton";

type TicketEarningType = "post" | "product" | "social";

export default function ScratchPlayActions({
  tickets,
  isAuthenticated,
  earnLoading,
  earnMsg,
  onEarn,
  claimLoading,
  claimMsg,
  onClaim,
  onPlay,
  loading,
  playing,
}: {
  tickets: number | null;
  isAuthenticated: boolean;
  earnLoading: TicketEarningType | null;
  earnMsg: Record<TicketEarningType, string>;
  onEarn: (type: TicketEarningType, tickets?: number) => void;
  claimLoading: boolean;
  claimMsg: string | null;
  onClaim: () => void;
  onPlay: () => void;
  loading: boolean;
  playing: boolean;
}) {
  return (
    <div className="mb-2 text-center">
      <div className="text-sm text-gray-700 mb-2">
        {tickets === 0
          ? "Bạn đã hết vé. Hãy thực hiện các hành động sau để nhận thêm vé:"
          : "Bạn có thể dùng vé để chơi hoặc nhận thêm vé:"}
      </div>
      <TicketEarningActions
        isAuthenticated={isAuthenticated}
        earnLoading={earnLoading}
        earnMsg={earnMsg}
        onEarn={onEarn}
      />
      <DailyTicketButton
        isAuthenticated={isAuthenticated}
        claimLoading={claimLoading}
        claimMsg={claimMsg}
        onClaim={onClaim}
      />
      <div className="mt-3">
        <button
          className="bg-gradient-to-br from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-black px-6 py-2 rounded-full shadow font-semibold text-lg transition disabled:opacity-60"
          onClick={onPlay}
          disabled={
            loading ||
            playing ||
            !isAuthenticated ||
            !tickets ||
            tickets < 1
          }
        >
          {loading
            ? "Đang tải..."
            : !isAuthenticated
            ? "Đăng nhập để chơi"
            : tickets && tickets > 0
            ? "Dùng 1 vé để chơi"
            : "Hết vé"}
        </button>
      </div>
      {!isAuthenticated && (
        <div className="mt-2 text-xs text-red-600">
          Vui lòng đăng nhập để nhận vé minigame.
        </div>
      )}
    </div>
  );
}