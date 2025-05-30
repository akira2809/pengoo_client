import {
  motion,
  // useMotionTemplate, // Không dùng đến, có thể xóa
  useScroll,
  useTransform,
} from "framer-motion";
import { SiSpacex } from "react-icons/si"; // Bạn có thể xóa nếu không dùng
import { FiArrowRight } from "react-icons/fi"; // Bạn có thể xóa nếu không dùng
import { useRef } from "react";
import Image from "next/image"; // Import Image từ Next.js

// Dữ liệu text cho phần hero
const HERO_TEXT = {
  subtitle: "Thương hiệu Pengoo",
  title: "Tôn vinh bàn tay & trí tuệ của nghệ sỹ, nghệ nhân Việt Nam",
};

// Chiều cao của section để ảnh có thể phóng to và text xuất hiện
// Chiều cao này quyết định độ dài cuộn để hoàn thành animation
const SECTION_SCROLL_DISTANCE = 1500; // Cuộn 1500px để hoàn thành animation phóng to
const TEXT_FADE_START_SCROLL = SECTION_SCROLL_DISTANCE * 0.6; // Bắt đầu hiện text khi cuộn được 60%
const TEXT_FADE_END_SCROLL = SECTION_SCROLL_DISTANCE * 0.9; // Hiện hoàn toàn text khi cuộn được 90%

// KHÔNG CÒN ReactLenis BAO QUANH NỮA
export const SmoothScrollHero = () => {
  return (
    <div className="bg-background-100"> {/* Thay đổi màu nền nếu cần, ví dụ bg-white hoặc bg-background-100 */}
      <Hero />
      {/* Đây là nơi bạn sẽ thêm các section nội dung khác của mình */}
      
    </div>
  );
};

// Bạn có thể giữ hoặc xóa Nav nếu không phù hợp với thiết kế
const Nav = () => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-3 text-white">
      <SiSpacex className="text-3xl mix-blend-difference" />
      <button
        onClick={() => {
          document.getElementById("launch-schedule")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
        className="flex items-center gap-1 text-xs text-zinc-400"
      >
        LIÊN HỆ <FiArrowRight /> {/* Đổi text */}
      </button>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // Kích hoạt animation trong suốt chiều cao của hero section
  });

  // Scale và position của ảnh
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.2, 1]); // Từ 20% kích thước ban đầu đến 100%
  // imageX và imageY không thay đổi, vì ảnh được căn giữa và phóng to tại chỗ
  // const imageX = useTransform(scrollYProgress, [0, 1], [0, 0]);
  // const imageY = useTransform(scrollYProgress, [0, 1], [0, 0]);

  // Opacity và Y position của text
  const textOpacity = useTransform(
    scrollYProgress,
    [
      TEXT_FADE_START_SCROLL / SECTION_SCROLL_DISTANCE, // Bắt đầu fade in
      TEXT_FADE_END_SCROLL / SECTION_SCROLL_DISTANCE // Kết thúc fade in
    ],
    [0, 1] // Opacity từ 0 đến 1
  );
  const textY = useTransform(
    scrollYProgress,
    [
      TEXT_FADE_START_SCROLL / SECTION_SCROLL_DISTANCE,
      TEXT_FADE_END_SCROLL / SECTION_SCROLL_DISTANCE
    ],
    [50, 0] // Di chuyển từ 50px xuống 0px
  );

  return (
    // Height của div này là tổng của SECTION_SCROLL_DISTANCE + 100vh để có đủ không gian cuộn.
    // 100vh đầu tiên là phần sticky, SECTION_SCROLL_DISTANCE là khoảng cách cuộn để animation diễn ra.
    <div
      ref={containerRef}
      style={{ height: `calc(${SECTION_SCROLL_DISTANCE}px + 100vh)` }}
      className="relative w-full"
    >
      {/* Background gradient để chuyển tiếp mượt mà sang nội dung phía dưới */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-white/0 to-white" />

      {/* Sticky container cho ảnh và text */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Wrapper cho ảnh: ban đầu rất nhỏ, sau đó phóng to */}
        <motion.div
          className="relative w-full h-full" // Quan trọng: width/height 100% để scale có ý nghĩa
          style={{
            scale: imageScale,
          }}
        >
          {/* Image component của Next.js */}
          <Image
            src="/craftsmanship-2-3200x1600.jpg" // Đảm bảo ảnh này nằm trong thư mục `public` của bạn
            alt={HERO_TEXT.title}
            layout="fill" // Chiếm toàn bộ không gian của motion.div parent
            objectFit="cover" // Đảm bảo ảnh phủ đầy và cắt bớt nếu cần
            priority // Tải sớm ảnh này
            quality={90} // Chất lượng cao
            className="filter brightness-[0.8]" // Giảm độ sáng ảnh một chút để text dễ đọc
          />
        </motion.div>

        {/* Text container, xuất hiện khi ảnh phóng to */}
        <motion.div
          className="absolute z-10 text-center px-4 max-w-4xl mx-auto text-white"
          style={{ opacity: textOpacity, y: textY }}
        >
          <p className="text-sm md:text-base font-semibold text-gray-200 mb-2">
            {HERO_TEXT.subtitle}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
            {HERO_TEXT.title}
          </h1>
        </motion.div>
      </div>
    </div>
  );
};