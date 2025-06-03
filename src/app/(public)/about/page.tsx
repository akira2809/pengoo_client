// app/about/page.tsx (Ví dụ với App Router)
import AboutUsBanner from '@/components/layouts/About/section/AboutUsBanner'; // Đảm bảo đường dẫn alias đúng
import AboutPageContent from '@/components/layouts/About/AboutPageContent';
const AboutPage: React.FC = () => {
  return (
    <main>
      {/* Thay đổi đường dẫn ảnh cho phù hợp với dự án của bạn */}
      <AboutUsBanner title="VỀ PENGOO" backgroundImage="/MM_CRAFTMANSHIP_25.webp" />
      {/* Các nội dung khác của trang giới thiệu */}
      <AboutPageContent />
    </main>
  );
};

export default AboutPage;