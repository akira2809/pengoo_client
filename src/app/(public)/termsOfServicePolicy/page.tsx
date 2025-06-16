// app/about/page.tsx (Ví dụ với App Router)
import PolicyBanner from '@/components/layouts/Policy/PolicyBanner'; // Đảm bảo đường dẫn alias đúng
import TermsOfServiceContent from '@/components/layouts/Policy/TermsOfServiceContent'; // Giả sử bạn có một component nội dung cho trang này
const ShippingPolicyPage: React.FC = () => {
  return (
    <main>
      {/* Thay đổi đường dẫn ảnh cho phù hợp với dự án của bạn */}
      <PolicyBanner title="Điều khoản dịch vụ"/>
      {/* Các nội dung khác của trang giới thiệu */}
      <TermsOfServiceContent />

    </main>
  );
};

export default ShippingPolicyPage;