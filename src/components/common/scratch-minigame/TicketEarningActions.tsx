import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { apiClient } from "@/app/api/apiClient";
import { productService } from "@/app/api/services/productService";
import { fetchAllPosts } from "@/app/api/services/blogApi";

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
  const [limitReached, setLimitReached] = useState(false);
  const router = useRouter();

  // Helper to get random detail page using correct slug/canonical
  const getRandomDetailHref = async (type: TicketEarningType) => {
    if (type === "product") {
      // Use productService to get products with slug
      const res = await productService.getProducts({ limit: 100 });
      const products = res.data || [];
      if (products.length > 0) {
        const random = products[Math.floor(Math.random() * products.length)];
        return `/products/${random.slug}`;
      }
      return "/products";
    }
    if (type === "post") {
      // Use blogApi to get posts with canonical
      const posts = await fetchAllPosts();
      if (posts.length > 0) {
        const random = posts[Math.floor(Math.random() * posts.length)];
        return `/blogs/${random.canonical || random.id}`;
      }
      return "/blogs";
    }
    if (type === "social") {
      return `https://facebook.com/sharer/sharer.php?u=https://pengoo.store/`;
    }
    return "/";
  };

  const handleEarn = async (type: TicketEarningType) => {
    if (!isAuthenticated || limitReached) return;
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

      if (msg.includes("limit for today")) {
        setLimitReached(true);
        toast.error("Bạn đã đạt giới hạn nhận vé hôm nay.");
        return;
      }

      const href = await getRandomDetailHref(type);

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
          }, 600);
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
            disabled={loading === opt.type || !isAuthenticated || limitReached}
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
      {limitReached && (
        <div className="text-xs text-red-600 text-center mt-2">
          Bạn đã đạt giới hạn nhận vé minigame hôm nay. Hãy quay lại vào ngày mai!
        </div>
      )}
    </div>
  );
}