import React from 'react';
import Image from 'next/image'; // Import Image từ Next.js
import { FiArrowRight } from 'react-icons/fi'; // Icon mũi tên phải (tùy chọn, bạn có thể xóa nếu không dùng)

// Định nghĩa kiểu dữ liệu cho một bài viết blog
interface BlogPost {
  id: string;
  imageSrc: string;
  title: string;
  excerpt: string; // Đoạn trích dẫn ngắn
  date: string;
  link: string; // Đường dẫn đến bài viết chi tiết
}

// Dữ liệu mẫu (có thể thay thế bằng dữ liệu từ API)
const DUMMY_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    imageSrc: '/craftsmanship-2-3200x1600.jpg', // Đảm bảo ảnh này nằm trong thư mục `public` của bạn
    title: "Gợi ý những SET QUÀ TẾT Ý NGHĨA CHO MÙA XUÂN NĂM NAY",
    excerpt: "Tết Nguyên Đán là dịp để chúng ta bày tỏ sự tri ân và tình cảm với những người thân yêu, đồng nghiệp và đối tác. Nhưng làm sao để chọn được quà Tết phù hợp, ấn tượng và có ý nghĩa? Cùng Maztermind...",
    date: "17 Thg 1, 2024",
    link: "/craftsmanship-2-3200x1600.jpg",
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
  title = "Blogs and News",
  viewAllLink = "/blog"
}) => {
  return (
    <section className="bg-background-50 py-16 px-4 md:py-24">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header Section: Title and View All Button */}
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

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <a key={post.id} href={post.link} className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
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
                  {/* Date */}
                  <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-800 transition-colors duration-200">
                    {post.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="text-base text-gray-600 leading-relaxed line-clamp-3"> {/* Giới hạn 3 dòng */}
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