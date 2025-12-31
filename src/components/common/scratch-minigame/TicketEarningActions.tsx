import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
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

// Helper for localStorage key
const STORAGE_KEY = "ticketEarnUsage";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getUsageFromStorage(): Record<TicketEarningType, boolean> {
  const today = getTodayKey();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        return parsed.usage;
      }
    } catch {}
  }
  // Reset for today
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ date: today, usage: { post: false, product: false, social: false } })
  );
  return { post: false, product: false, social: false };
}

function setUsageToStorage(usage: Record<TicketEarningType, boolean>) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ date: getTodayKey(), usage })
  );
}

export default function TicketEarningActions({
  isAuthenticated,
  earnLoading,
  earnMsg,
  onEarn,
}: {
  isAuthenticated: boolean;
  earnLoading: TicketEarningType | null;
  earnMsg: Record<TicketEarningType, string>;
  onEarn: (type: TicketEarningType, tickets?: number) => Promise<void>;
}) {
  const [usedToday, setUsedToday] = useState<Record<TicketEarningType, boolean>>({
    post: false,
    product: false,
    social: false,
  });
  const [messages, setMessages] = useState<Record<TicketEarningType, string>>({
    post: "",
    product: "",
    social: "",
  });
  const [] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUsedToday(getUsageFromStorage());
  }, []);

  // Helper to get random detail page using correct slug/canonical
  const getRandomDetailHref = async (type: TicketEarningType) => {
    if (type === "product") {
      const res = await productService.getProducts({ limit: 100 });
      const products = res.data || [];
      if (products.length > 0) {
        const random = products[Math.floor(Math.random() * products.length)];
        return `/products/${random.slug}`;
      }
      return "/products";
    }
    if (type === "post") {
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
    // Prevent API call if button should be disabled
    if (
      earnLoading === type ||
      !isAuthenticated ||
      usedToday[type]
    ) {
      return;
    }
    if (!isAuthenticated) {
      toast.error("Bạn cần đăng nhập để nhận vé.");
      return;
    }
    if (usedToday[type]) {
      toast.error("Bạn đã nhận vé này hôm nay rồi.");
      return;
    }
    setMessages((prev) => ({ ...prev, [type]: "" }));

    try {
      await onEarn(type); // Wait for backend confirmation before marking as used
      // Mark as used for today
      const newUsage = { ...usedToday, [type]: true };
      setUsedToday(newUsage);
      setUsageToStorage(newUsage);
      setMessages((prev) => ({
        ...prev,
        [type]: "Đã nhận vé!",
      }));
      toast.success("Đã nhận vé!");
      // Optionally, redirect or open social share
      const href = await getRandomDetailHref(type);
      if (type === "social") {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
      }
    } catch (error: unknown) {
      const errorMsg =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : undefined;
      setMessages((prev) => ({
        ...prev,
        [type]: errorMsg || "Có lỗi xảy ra, vui lòng thử lại.",
      }));
      toast.error(errorMsg || "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-center mb-2">
      {TICKET_EARNING_OPTIONS.map(opt => (
        <div key={opt.type} className="flex items-center gap-2 justify-center">
          <span className={`min-w-[110px] text-sm font-semibold text-${opt.color}-700`}>
            {opt.label}
          </span>
          <button
            className={`bg-${opt.color}-100 text-${opt.color}-700 px-3 py-1 rounded shadow text-xs font-medium hover:bg-${opt.color}-200 transition disabled:opacity-60`}
            disabled={
              earnLoading === opt.type ||
              !isAuthenticated ||
              usedToday[opt.type]
            }
            onClick={() => handleEarn(opt.type)}
          >
            {earnLoading === opt.type
              ? "Đang nhận..."
              : usedToday[opt.type]
              ? "Đã nhận hôm nay"
              : `Nhận +${opt.tickets} vé`}
          </button>
          {(messages[opt.type] || earnMsg[opt.type]) && (
            <span className="ml-2 text-xs text-green-700">{messages[opt.type] || earnMsg[opt.type]}</span>
          )}
        </div>
      ))}
    </div>
  );
}