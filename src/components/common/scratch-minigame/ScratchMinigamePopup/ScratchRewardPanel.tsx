interface ScratchResult {
  message?: string;
  gridScore?: number;
  bonus?: number;
  userPoints?: number;
  tickets?: number;
  couponGranted?: boolean;
  couponCode?: string | null;
  grid?: string[][];
  winLines?: Array<{type: 'row' | 'col' | 'diag'; index: number}>;
  reward?: {
    type: string;
    value: number;
    description: string;
  };
}

export default function ScratchRewardPanel({ result }: { result: ScratchResult }) {
  // Provide default values for optional properties
  const {
    message = '',
    gridScore = 0,
    bonus = 0,
    userPoints = 0,
    tickets = 0,
    couponGranted = false,
    couponCode = null
  } = result;

  return (
    <div className="w-full mt-2">
      <div className="flex flex-col items-center">
        {message && (
          <div className="mt-2 text-base font-semibold text-green-700 text-center">
            {message}
          </div>
        )}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium shadow">
            +{gridScore} điểm{bonus > 0 && ` (+${bonus} bonus)`}
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium shadow">
            Điểm tích lũy: {userPoints ?? "?"}
          </span>
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium shadow">
            Vé còn lại: {tickets}
          </span>
        </div>
        {couponGranted && couponCode && (
          <div className="mt-3 text-yellow-700 font-bold text-base bg-yellow-100 px-3 py-2 rounded shadow text-center">
            🎁 Coupon: <span className="underline">{couponCode}</span>
          </div>
        )}
      </div>
    </div>
  );
}