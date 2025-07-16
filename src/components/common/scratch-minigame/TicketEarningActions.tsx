import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { apiClient } from "@/app/api/apiClient";

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
  onEarn: (type: TicketEarningType, tickets?: number) => void;
}) {
  const [loading, setLoading] = useState<TicketEarningType | null>(null);
  const [messages, setMessages] = useState<Record<TicketEarningType, string>>({
    post: "",
    product: "",
    social: "",
  });
  const router = useRouter();

  // Helper to get random detail page using current backend
  const getRandomDetailHref = async (type: TicketEarningType) => {
    if (type === "product") {
      // Fetch all products, pick a random one
      const res = await apiClient.get<any[]>("/products?limit=100");
      if (res.data && res.data.length > 0) {
        const random = res.data[Math.floor(Math.random() * res.data.length)];
        return `/products/${random.slug}`;
      }
      return "/products";
    }
    if (type === "post") {
      // Fetch all posts, pick a random one
      const res = await apiClient.get<any[]>("/posts");
      if (res.data && res.data.length > 0) {
        const random = res.data[Math.floor(Math.random() * res.data.length)];
        return `/blogs/${random.canonical}`;
      }
      return "/blogs";
    }
    if (type === "social") {
      return "https://facebook.com/sharer/sharer.php?u=https://pengoo.vn";
    }
    return "/";
  };

  // Call backend to earn ticket and prevent duplicate claims
  const handleEarn = async (type: TicketEarningType) => {
    if (!isAuthenticated) return;
    setLoading(type);
    setMessages((prev) => ({ ...prev, [type]: "" }));

    try {
      // Generate a random refId for demo (in real use, use actual post/product/social id)
      const refId = Math.random().toString(36).slice(2, 10);
      const res = await apiClient.post<{ message: string; tickets: number }>(
        "/minigame/earn-ticket",
        { type, refId }
      );
      const msg = res.data?.message || "Đã nhận vé!";
      setMessages((prev) => ({
        ...prev,
        [type]: msg,
      }));
      if (res.data?.tickets !== undefined) {
        if (onEarn) onEarn(type, res.data.tickets); // This will trigger parent's refresh
      }
      // Show toast only if actually earned
      if (msg.includes("earned") || msg.includes("Đã nhận vé")) {
        toast.success(msg);
      } else {
        toast(msg, { icon: "ℹ️" });
      }

      // Navigate after success (except for social)
      const href = await getRandomDetailHref(type);
      if (type === "social") {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        setTimeout(() => {
          router.push(href);
        }, 500);
      }
    } catch (err: any) {
      setMessages((prev) => ({
        ...prev,
        [type]: err?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      }));
      toast.error(err?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-center mb-2">
      {TICKET_EARNING_OPTIONS.map(opt => (
        <div key={opt.type} className="flex items-center gap-2 justify-center">
          <button
            className={`bg-${opt.color}-100 text-${opt.color}-700 px-3 py-1 rounded shadow text-xs font-medium hover:bg-${opt.color}-200`}
            disabled={loading === opt.type || !isAuthenticated}
            onClick={() => handleEarn(opt.type)}
          >
            {loading === opt.type ? "Đang nhận..." : opt.label}
          </button>
          <span className="text-xs text-gray-600">
            +{opt.tickets} vé
          </span>
          {(messages[opt.type] || earnMsg[opt.type]) && (
            <span className="ml-2 text-xs text-green-700">{messages[opt.type] || earnMsg[opt.type]}</span>
          )}
        </div>
      ))}
    </div>
  );
}