import ContactSection from '@/components/layouts/Contact/ContactSection';
import Layout from '@/components/common/UI/85%';
import { BlogSection } from '@/components/common/BlogSection';
import PolicyBanner from '@/components/layouts/Policy/PolicyBanner'; // Đảm bảo đường dẫn alias đúng



const PartnerPage = () => {
  return (
    <Layout>
      <PolicyBanner title="Hợp tác"/>
      <ContactSection
        imageUrl="/about.webp"
        altText="Đối tác mua sỉ"
        title="Đôi tác mua sỉ"
        description={`Không chỉ mang đến những sản phẩm chất lượng, Pengoo còn đảm bảo hỗ trợ Khách hàng mua sỉ những chương trình chiết khấu ưu đãi nhất.`}
      />

      <ContactSection
        imageUrl="/about.webp"
        altText="Quà tặng doanh nghiệp"
        title="Quà tặng doanh nghiệp"
        description={`Để tạo được một ấn tượng tốt và hiệu quả lâu dài thì lựa chọn đúng các sản phẩm Quà tặng và truyền tải đúng các thông điệp là vô cùng quan trọng. Chính vì điều đó, với đội ngũ tư vấn giàu kinh nghiệm, đội ngũ thiết kế sáng tạo và đội ngũ triển khai nhiệt tình, Pengoo tin tưởng sẽ mang đến những trải nghiệm tuyệt vời nhất cho Quý khách hàng.`}
      />
      
      <BlogSection />
      
    </Layout>
  );
};

export default PartnerPage;
