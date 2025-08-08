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

interface Product {
  slug: string;
  [key: string]: unknown;
}

interface Post {
  canonical: string;
  [key: string]: unknown;
}

export default function TicketEarningActions({
  isAuthenticated,
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
      const res = await apiClient.get<{ data: Product[] }>("/products?limit=100");
      const products = res.data?.data || [];
      if (products.length > 0) {
        const random = products[Math.floor(Math.random() * products.length)];
        return `/products/${random.slug}`;
      }
      return "/products";
    }
    if (type === "post") {
      const res = await apiClient.get<{ data: Post[] }>("/posts");
      const posts = res.data?.data || [];
      if (posts.length > 0) {
        const random = posts[Math.floor(Math.random() * posts.length)];
        return `/blogs/${random.canonical}`;
      }
      return "/blogs";
    }
    if (type === "social") {
      // Use the correct sharing link
      return `https://facebook.com/sharer/sharer.php?u=https://pengoo.store/`;
    }
    return "/";
  };

  // Call backend to earn ticket and prevent duplicate claims
  const handleEarn = async (type: TicketEarningType) => {
    if (!isAuthenticated) return;
    setLoading(type);
    setMessages((prev) => ({ ...prev, [type]: "" }));

    try {
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
        if (onEarn) onEarn(type, res.data.tickets);
      }

      const href = await getRandomDetailHref(type);

      // Navigate first, then show toast after navigation
      if (type === "social") {
        window.open(href, "_blank", "noopener,noreferrer");
        setTimeout(() => {
          toast.success(msg);
        }, 500);
      } else {
        setTimeout(() => {
          router.push(href);
          setTimeout(() => {
            toast.success(msg);
          }, 600); // Show toast after navigation
        }, 300);
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Có lỗi xảy ra, vui lòng thử lại.";
      setMessages((prev) => ({
        ...prev,
        [type]: errorMessage,
      }));
      toast.error(errorMessage);
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