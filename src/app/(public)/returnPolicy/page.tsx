// app/about/page.tsx (Ví dụ với App Router)
import PolicyBanner from '@/components/layouts/Policy/PolicyBanner'; // Đảm bảo đường dẫn alias đúng
import ReturnContent from '@/components/layouts/Policy/ReturnContent'; // Giả sử bạn có một component nội dung cho trang này
import { BlogSection } from '@/components/common/BlogSection';


const ReturnPolicyPage: React.FC = () => {
  return (
    <main>
      {/* Thay đổi đường dẫn ảnh cho phù hợp với dự án của bạn */}
      <PolicyBanner title="Chính sách Hoàn tiền & Đổi trả"/>
      {/* Các nội dung khác của trang giới thiệu */}
      <ReturnContent />
      <BlogSection />

    </main>
  );
};

export default ReturnPolicyPage;