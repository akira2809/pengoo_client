// app/about/page.tsx (Ví dụ với App Router)
import PolicyBanner from '@/components/layouts/Policy/PolicyBanner'; // Đảm bảo đường dẫn alias đúng
import PromotionContent from '@/components/layouts/Policy/PromotionContent'; // Giả sử bạn có một component nội dung cho trang này
import { BlogSection } from '@/components/common/BlogSection';


const PromotionPolicyPage: React.FC = () => {
  return (
    <main>
      {/* Thay đổi đường dẫn ảnh cho phù hợp với dự án của bạn */}
      <PolicyBanner title="Chính sách Khuyến mãi"/>
      {/* Các nội dung khác của trang giới thiệu */}
      <PromotionContent />
      {/* Phần blog hoặc các phần khác */}
      <BlogSection />

    </main>
  );
};

export default PromotionPolicyPage;