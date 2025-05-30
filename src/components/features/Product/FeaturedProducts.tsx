import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap"; // Import thư viện GSAP

// Dữ liệu mẫu cho các sản phẩm
const products = [
  {
    id: 1,
    name: "Block",
    image: "/MM_BoxSet4_2-min.png",
    hoverImage: "/Spacefest-Poker_HeroBanner_PC-min.png", // Đã sửa hoverImage để tạo sự khác biệt
    price: "1.945.200đ",
    originalPrice: "2.590.200đ",
    discount: "-25%",
  },
  {
    id: 2,
    name: "Block",
    image: "/MM_BoxSet4_2-min.png",
    hoverImage: "/MM_BoxSet4_1-min.png",
    price: "1.945.200đ",
    originalPrice: "2.590.200đ",
    discount: "-25%",
  },
  {
    id: 3,
    name: "Block",
    image: "/MM_BoxSet4_2-min.png",
    hoverImage: "/MM_BoxSet4_1-min.png",
    price: "1.945.200đ",
    originalPrice: "2.590.200đ",
    discount: "-25%",
  },
  {
    id: 4,
    name: "Block",
    image: "/MM_BoxSet4_2-min.png",
    hoverImage: "/MM_BoxSet4_1-min.png",
    price: "1.945.200đ",
    originalPrice: "2.590.200đ",
    discount: "-25%",
  },
  {
    id: 5,
    name: "Block",
    image: "/MM_BoxSet4_2-min.png",
    hoverImage: "/MM_BoxSet4_1-min.png",
    price: "1.945.200đ",
    originalPrice: "2.590.200đ",
    discount: "-25%",
  },
  {
    id: 6,
    name: "Block",
    image: "/MM_BoxSet4_2-min.png",
    hoverImage: "/MM_BoxSet4_1-min.png",
    price: "1.945.200đ",
    originalPrice: "2.590.200đ",
    discount: "-25%",
  },
];

export default function FeaturedProducts() {
  // Sử dụng useRef để tham chiếu đến các phần tử HTML cần animate
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const viewAllLinkRef = useRef<HTMLAnchorElement>(null);
  const productsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Đảm bảo rằng tất cả các phần tử đã được render trước khi chạy animation
    if (
      !sectionRef.current ||
      !headingRef.current ||
      !descriptionRef.current ||
      !viewAllLinkRef.current ||
      !productsContainerRef.current
    ) {
      return;
    }

    // Tạo một timeline chính cho toàn bộ animation khi tải trang
    // `defaults` đặt các thuộc tính mặc định cho tất cả các tween trong timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animation cho tiêu đề (h2)
    // Trượt từ dưới lên (y: 30) và hiện dần (opacity: 0)
    tl.from(headingRef.current, { y: 30, opacity: 0, duration: 0.8 })
      // Animation cho mô tả (p)
      // Bắt đầu 0.2 giây trước khi animation trước đó kết thúc ("<0.2")
      .from(descriptionRef.current, { y: 30, opacity: 0, duration: 0.8 }, "<0.2")
      // Animation cho nút "Xem tất cả" (a)
      // Trượt từ phải sang (x: 30) và hiện dần (opacity: 0)
      // Bắt đầu 0.2 giây trước khi animation trước đó kết thúc ("<0.2")
      .from(viewAllLinkRef.current, { x: 30, opacity: 0, duration: 0.8 }, "<0.2")
      // Animation cho từng thẻ sản phẩm
      // Chọn tất cả các phần tử có class 'product-card'
      // Trượt từ dưới lên (y: 50), hiện dần (opacity: 0) và có hiệu ứng trễ (stagger)
      // Bắt đầu 0.3 giây trước khi animation trước đó kết thúc ("<0.3")
      .from(
        '.product-card',
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15, // Tạo độ trễ 0.15 giây giữa mỗi thẻ sản phẩm
        },
        "<0.3"
      );

    // Dọn dẹp timeline khi component bị unmount để tránh rò rỉ bộ nhớ
    return () => {
      tl.kill();
    };
  }, []); // [] đảm bảo useEffect chỉ chạy một lần sau khi component được mount

  return (
    <section ref={sectionRef} className="max-w-screen-2xl mx-auto px-4 py-12 sm:px-6 lg:px-16">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0">
        <div>
          {/* Gắn ref vào tiêu đề */}
          <h2 ref={headingRef} className="text-3xl sm:text-4xl font-extrabold mb-3 text-text-900">
            Sản phẩm nổi bật
          </h2>
          {/* Gắn ref vào đoạn mô tả */}
          <p ref={descriptionRef} className="text-gray-600 leading-relaxed text-sm sm:text-base max-w-xl">
            Khám phá những sản phẩm board games được yêu thích nhất, nổi tiếng
            với thiết kế tinh tế, chế tác thủ công và chất liệu bền vững. Pengoo
            mang đến một trải nghiệm chơi cao cấp, khác biệt.
          </p>
        </div>
        {/* Gắn ref vào liên kết "Xem tất cả" */}
        <a
          ref={viewAllLinkRef}
          href="#"
          className="text-gray-700 font-medium hover:underline flex items-center gap-1 whitespace-nowrap text-sm sm:text-base"
        >
          Xem tất cả{" "}
          <span className="text-blue-600">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </a>
      </div>

      {/* Gắn ref vào container chứa các sản phẩm */}
      <div ref={productsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-9">
        {products.map((product) => (
          <div
            key={product.id}
            // Thêm class 'product-card' để GSAP có thể chọn từng phần tử cho animation
            className="product-card bg-[#F5F5F5] rounded-3xl p-4 relative group transition-transform hover:scale-[1.02] cursor-pointer"
          >
            {/* Hiển thị nhãn giảm giá nếu có */}
            {product.discount && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
                {product.discount}
              </div>
            )}

            {/* Container cho hình ảnh sản phẩm với hiệu ứng hover */}
            <div className="relative w-full h-[320px] sm:h-[440px] flex items-center justify-center overflow-hidden">
              {/* Ảnh chính (hiển thị mặc định), mờ dần khi hover */}
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain z-0 transition-opacity duration-500 group-hover:opacity-0"
                // Bạn có thể thêm `priority={true}` cho hình ảnh của sản phẩm đầu tiên để tối ưu LCP (Largest Contentful Paint)
                // Ví dụ: priority={product.id === 1}
              />

              {/* Ảnh khi hover (ẩn mặc định, hiện rõ khi hover) */}
              <Image
                src={product.hoverImage}
                alt={product.name + " hover"}
                fill
                className="object-contain z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>

            {/* Thông tin chi tiết sản phẩm */}
            <div className="mt-4">
              <h3 className="text-sm sm:text-base font-medium text-black">
                {product.name}
              </h3>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-red-600 font-bold">{product.price}</span>
                <span className="text-gray-400 line-through text-sm">
                  {product.originalPrice}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}