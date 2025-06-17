import ContactSection from '@/components/layouts/Contact/ContactSection';
import Layout from '@/components/common/UI/85%';

const ContactPage = () => {
  return (
    <Layout>
      <ContactSection
        imageUrl="/about.webp"
        altText="Showroom"
        title="Showroom"
        description={`<strong>Địa chỉ:</strong> 6/10 Cách Mạng Tháng 8, P.Bến Thành, Q1, TP.HCM\n
            <strong>Thời gian làm việc:</strong> 9:00 - 22:00\n
            <strong>Hotline:</strong> 012345678`}
      />

      <ContactSection
        imageUrl="/about.webp"
        altText="Gói quà miễn phí"
        title="Gói quà miễn phí"
        description={`Tận tay chọn món quà đầy tinh tế và sang trọng tại showroom để bạn gửi gắm tình cảm và sự quan tâm đến ai đó một cách trọn vẹn nhất.`}
      />

      <ContactSection
        imageUrl="/about.webp"
        altText="Trải nghiệm sản phẩm thực tế"
        title="Trải nghiệm sản phẩm thực tế"
        description={`Pengoo luôn tự hào với những người nghệ nhân Việt xuất chúng đã và đang làm ra các sản phẩm board games làm từ chất liệu hài hòa tạo nên giá trị bền vững, cùng vẻ đẹp tối giản thanh lịch.\n
                    Thông thường khách hàng chỉ có thể cảm nhận tâm huyết của họ qua các ấn phẩm trên trang mạng xã hội và website suốt 6 năm qua, nay <strong>Pengoo đã có showroom đầu tiên</strong> tại TP.HCM.\n
                    Hãy ghé ngay hôm nay và trải nghiệm <strong>30+ board games độc đáo</strong> tại 6/10 Cách Mạng Tháng 8, P.Bến Thành, Q1, TP.HCM và nhận nhiều ưu đãi hấp dẫn!`}

      />
    </Layout>
  );
};

export default ContactPage;
