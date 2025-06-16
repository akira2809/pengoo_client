// app/about/page.tsx (Ví dụ với App Router)
import PolicyBanner from '@/components/layouts/Policy/PolicyBanner'; // Đảm bảo đường dẫn alias đúng
import ShippingContent from '@/components/layouts/Policy/ShippingContent'; // Giả sử bạn có một component nội dung cho trang này
const ShippingPolicyPage: React.FC = () => {
  return (
    <main>
      {/* Thay đổi đường dẫn ảnh cho phù hợp với dự án của bạn */}
      <PolicyBanner title="Chính sách đổi trả và bảo hành"/>
      {/* Các nội dung khác của trang giới thiệu */}
      <ShippingContent />

    </main>
  );
};

export default ShippingPolicyPage;