// app/about/page.tsx
import { Metadata } from 'next'; // Import Metadata type
import AboutUsBanner from '@/components/layouts/About/section/AboutUsBanner';
import AboutPageContent from '@/components/layouts/About/AboutPageContent';

// --- SEO: Định nghĩa Metadata cho trang About Us ---
export const metadata: Metadata = {
  title: 'Về PENGOO - Câu Chuyện & Sứ Mệnh Của Chúng Tôi', // Tiêu đề trang cụ thể
  description: 'Tìm hiểu về PENGOO - cửa hàng board game hàng đầu Việt Nam. Khám phá câu chuyện, sứ mệnh, và cam kết của chúng tôi trong việc mang đến những trải nghiệm giải trí và gắn kết ý nghĩa.', // Mô tả trang
  keywords: [
    'về PENGOO', 'câu chuyện PENGOO', 'sứ mệnh PENGOO', 'lịch sử PENGOO',
    'giới thiệu PENGOO', 'board game Việt Nam', 'cửa hàng board game uy tín',
    'giá trị PENGOO', 'đội ngũ PENGOO'
  ],
  alternates: {
    canonical: 'https://pengoo.vn/about', // URL chuẩn của trang này
  },
  openGraph: {
    title: 'Về PENGOO - Câu Chuyện & Sứ Mệnh',
    description: 'Tìm hiểu về PENGOO và cam kết của chúng tôi với board game.',
    url: 'https://pengoo.vn/about',
    images: [
      {
        url: 'https://pengoo.vn/images/about-og-image.jpg', // Ảnh OG riêng cho trang About
        width: 1200,
        height: 630,
        alt: 'PENGOO - Giới thiệu về chúng tôi',
      },
    ],
    type: 'website', // Hoặc 'article' nếu nội dung rất dài và chi tiết
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Về PENGOO - Câu Chuyện & Sứ Mệnh',
    description: 'Tìm hiểu về PENGOO và cam kết của chúng tôi với board game.',
    images: ['https://pengoo.vn/images/about-twitter-image.jpg'], // Ảnh Twitter riêng cho trang About
  },
  // Bạn có thể thêm robots, authors, generator nếu muốn, nhưng thường đã có trong RootLayout
};
// --- Hết phần SEO ---

const AboutPage: React.FC = () => {
  return (
    <main>
      {/* Thay đổi đường dẫn ảnh cho phù hợp với dự án của bạn */}
      <AboutUsBanner title="VỀ PENGOO" backgroundImage="/VNIBanner.png" />
      {/* Các nội dung khác của trang giới thiệu */}
      <AboutPageContent />
    </main>
  );
};

export default AboutPage;