import React from 'react';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi'; // Giữ lại icon nếu bạn muốn, nhưng UI mẫu không có

// Định nghĩa kiểu dữ liệu cho một bài viết blog
interface BlogPost {
  id: string;
  imageSrc: string;
  title: string;
  excerpt: string; // Đoạn trích dẫn ngắn
  date: string;
  link: string; // Đường dẫn đến bài viết chi tiết
}

// Dữ liệu mẫu (sử dụng lại dữ liệu ban đầu của bạn)
const DUMMY_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    imageSrc: '/board-game-card-design_699907-1.webp', // Đặt ảnh bạn muốn làm ảnh chính vào public folder và đặt tên đúng
    title: "Gợi Ý 5 Trò Chơi Board Games Hay Nhất Cho Hai Người Chơi",
    excerpt: "Có bao giờ bạn cảm thấy thắc mắc về nguồn gốc của từ “boardgame”? Từ này được ghép từ chữ “board” (bàn hoặc bảng) và “game” (trò chơi), mang hàm ý chỉ những trò chơi thường được chơi ở trên bàn ho...",
    date: "16 Thg 11, 2021", // Giữ nguyên ngày tháng từ UI mẫu
    link: "#", // Thay bằng link thật của bài viết
  },
  {
    id: '2',
    imageSrc: '/blog-image-2.jpg', // Đảm bảo ảnh này nằm trong thư mục `public` của bạn
    title: "HƯỚNG DẪN CÁCH CHƠI BẦU CUA TRĂM TRẬN TRĂM THẮNG",
    excerpt: "Trò chơi bầu cua tôm cá là một trong trò chơi truyền thống giải trí phổ biến ở Việt Nam vào các dịp lễ, đặc biệt là Tết Nguyên Đán với cách chơi đơn giản giúp gắn kết thêm rộn ràng hơn...",
    date: "15 Thg 1, 2024",
    link: "/blog/huong-dan-bau-cua",
  },
  {
    id: '3',
    imageSrc: '/blog-image-3.jpg', // Đảm bảo ảnh này nằm trong thư mục `public` của bạn
    title: "KHÁM PHÁ NIỀM VUI TẾT VỚI BỘ BẦU CUA Ý GIAO",
    excerpt: "Ngày Tết là dịp để gia đình, bạn bè và người thân sum họp, chia sẻ niềm vui và ước nguyện cho năm mới. Ngoài những hoạt động truyền thống như cúng thừa, bản pháo hoa, xông nhà, lì xì... thì vị...",
    date: "12 Thg 1, 2024",
    link: "/blog/kham-pha-bau-cua-y-giao",
  },
];

// Định nghĩa props cho component BlogSection
interface BlogSectionProps {
  posts?: BlogPost[]; // Mảng các bài viết blog, có thể không truyền vào (sẽ dùng dummy data)
  title?: string; // Tiêu đề của section, mặc định là "Blogs and News"
  viewAllLink?: string; // Link cho nút "View all", mặc định là "/blog"
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  posts = DUMMY_BLOG_POSTS, // Sử dụng dummy data nếu không có posts nào được truyền vào
  title = "Blogs and News", // Vẫn giữ tiêu đề chung cho section
  viewAllLink = "/blog"
}) => {
  return (
    <section className=" py-16 px-4 md:py-24"> {/* Đổi nền section sang trắng */}
      <div className="max-w-screen-xl mx-auto"> {/* Tăng max-width để chứa nhiều blog */}
        {/* Header Section: Title and View All Button (Nếu bạn vẫn muốn giữ phần này) */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">
            {title}
          </h2>
          <a
            href={viewAllLink}
            className="flex items-center text-lg font-semibold text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            View all <FiArrowRight className="ml-2 text-xl" />
          </a>
        </div>

        {/* Blog Posts Grid - Điều chỉnh lại grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <a key={post.id} href={post.link} className="block group">
              <div className=" rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {/* Image */}
                <div className="relative w-full h-60 overflow-hidden">
                  <Image
                    src={post.imageSrc}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                    quality={75}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date - Theo UI, ngày tháng nằm ngay dưới ảnh hoặc trên tiêu đề */}
                  {/* Trong UI của bạn, ngày tháng nằm *dưới* đoạn trích dẫn, ta sẽ giữ lại cấu trúc ban đầu */}
                  <p className="text-sm text-gray-500 mb-2">{post.date}</p>

                  {/* Title - Điều chỉnh font và kích thước để giống UI */}
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-amber-800 transition-colors duration-200  leading-tight">
                    {post.title}
                  </h3>

                  {/* Excerpt - Điều chỉnh font, màu và line-height */}
                  <p className="text-base text-gray-700 leading-relaxed line-clamp-3 ">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};