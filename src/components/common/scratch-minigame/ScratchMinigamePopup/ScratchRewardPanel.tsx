export default function ScratchRewardPanel({ result }: { result: any }) {
  return (
    <div className="w-full mt-2">
      <div className="flex flex-col items-center">
        <div className="mt-2 text-base font-semibold text-green-700 text-center">
          {result.message}
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium shadow">
            +{result.gridScore} điểm{result.bonus > 0 && ` (+${result.bonus} bonus)`}
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium shadow">
            Điểm tích lũy: {result.userPoints ?? "?"}
          </span>
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium shadow">
            Vé còn lại: {result.tickets}
          </span>
        </div>
        {result.couponGranted && (
          <div className="mt-3 text-yellow-700 font-bold text-base bg-yellow-100 px-3 py-2 rounded shadow text-center">
            🎁 Coupon: <span className="underline">{result.couponCode}</span>
          </div>
        )}
      </div>
    </div>
  );
}