export default function TicketCountBadge({ tickets }: { tickets: number | null }) {
  return (
    <div className="flex items-center justify-center mb-2">
      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold text-sm shadow">
        Vé minigame: {tickets !== null ? tickets : "?"}
      </span>
    </div>
  );
}