type TicketEarningType = "post" | "product" | "social";
const TICKET_EARNING_OPTIONS: {
  type: TicketEarningType;
  label: string;
  tickets: number;
  color: string;
}[] = [
  { type: "post", label: "Đọc bài viết", tickets: 1, color: "blue" },
  { type: "product", label: "Xem sản phẩm", tickets: 1, color: "green" },
  { type: "social", label: "Chia sẻ mạng xã hội", tickets: 2, color: "pink" },
];

export default function TicketEarningActions({
  isAuthenticated,
  earnLoading,
  earnMsg,
  onEarn,
}: {
  isAuthenticated: boolean;
  earnLoading: TicketEarningType | null;
  earnMsg: Record<TicketEarningType, string>;
  onEarn: (type: TicketEarningType) => void;
}) {
  return (
    <div className="flex flex-col gap-2 justify-center mb-2">
      {TICKET_EARNING_OPTIONS.map(opt => (
        <div key={opt.type} className="flex items-center gap-2 justify-center">
          <button
            className={`bg-${opt.color}-100 text-${opt.color}-700 px-3 py-1 rounded shadow text-xs font-medium hover:bg-${opt.color}-200`}
            disabled={earnLoading === opt.type || !isAuthenticated}
            onClick={() => onEarn(opt.type)}
          >
            {earnLoading === opt.type ? "Đang nhận..." : opt.label}
          </button>
          <span className="text-xs text-gray-600">
            +{opt.tickets} vé
          </span>
          {earnMsg[opt.type] && (
            <span className="ml-2 text-xs text-green-700">{earnMsg[opt.type]}</span>
          )}
        </div>
      ))}
    </div>
  );
}