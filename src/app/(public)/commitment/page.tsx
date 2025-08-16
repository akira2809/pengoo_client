import Layout from '@/components/common/UI/85%';
import { BlogSection } from '@/components/common/BlogSection';
import PolicyBanner from '@/components/layouts/Policy/PolicyBanner'; // Đảm bảo đường dẫn alias đúng
import CommitmentCard from '@/components/layouts/Policy/CommitmentCard'; // Đảm bảo đường dẫn alias đúng


const Commitmentage = () => {
  return (
    <Layout>
      <PolicyBanner title="Cam kết"/>
      <CommitmentCard
        imageUrl="/free-shipping.png"
        altText="Miễn phí vận chuyển"
        title="Miễn phí vận chuyển cho đơn hàng trên 1 triệu"
        description={`Với mong muốn mang đến trải nghiệm tốt nhất, Pengoo cung cấp ưu đãi miễn phí vận chuyển dành cho quý khách đặt hàng tại website với hóa đơn bất kỳ trên 1,000,000 VND. Ưu đãi sẽ được tự động áp dụng trong quá trình thanh toán, khách hàng chỉ cần an tâm mua sắm trên website và tiến hành đặt hàng theo hướng dẫn.\n
                    Mọi thắc mắc xin liên hệ về hotline 012345678 hoặc email Info@Pengoo.store. Đọc thêm chi tiết về chính sách vận chuyển của Pengoo tại đây.`}
        />

        <CommitmentCard
        imageUrl="/handcrafted.png"
        altText="Sản phẩm thủ công"
        title="Sản phẩm sản xuất thủ công tại Việt Nam"
        description={`Lựa chọn hướng đi đề cao giá trị thẩm mỹ, Pengoo xây dựng đội ngũ thợ thủ công lành nghề để tạo ra những sản phẩm chỉn chu nhất. Với nhà máy tọa lạc tại Bình Chánh, tổng diện tích 750m2 và quy mô hơn 70 nghệ nhân, tất cả các công đoạn của quy trình sản xuất từ đúc khuôn, ghép da, đánh bóng, cắt may, mài giũa… đều được hoàn thiện thủ công. Thành phẩm tạo ra là một sự pha trộn hài hoà, giữa bộ óc người thiết kế và bàn tay người nghệ nhân.\n
                    Khám phá thêm các quy trình sản xuất thủ công của Pengoo tại đây.`}
        imageOnRight
        />

        <CommitmentCard
        imageUrl="/free-shipping.png"
        altText="Miễn phí vận chuyển"
        title="Phần lớn vật liệu thân thiện với môi trường"
        description={`Các sản phẩm của Pengoo được tạo nên từ sự phối trộn các chất liệu cứng cáp và có độ bền cao như đồng thau, xi măng, hay sắp đến sẽ bao gồm cả gốm, sơn mài. Đó đều là những vật liệu có giá trị lâu bền theo thời gian, nhằm giảm thiểu rác thải ra môi trường. Bên cạnh đó, Pengoo còn cung cấp thời gian bảo hành lên đến 12 tháng cũng như chính sách đổi trả linh hoạt đối với sản phẩm chưa hoàn thiện hay hư hỏng. Điều này giúp chúng ta quản lí và tái tạo những thành phẩm cho môi trường thêm xanh.\n
                    Khám phá thêm các sản phẩm Board Game của Pengoo với những chất liệu độc đáo.`}
        />

        <CommitmentCard
        imageUrl="/handcrafted.png"
        altText="Sản phẩm thủ công"
        title="Bảo hành từ 6- 12 tháng, cam kết đổi trả với sản phẩm bị lỗi"
        description={`Nhằm cung cấp dịch vụ làm hài lòng khách hàng, Pengoo rất sẵn sàng được lắng nghe ý kiến phản hồi của bạn. Chính sách bảo hành của chúng tôi yêu cầu sản phẩm có đầy đủ logo và bao bì đóng gói mang thương hiệu Pengoo, có hóa đơn thanh toán (đối với khách tại cửa hàng) hoặc email xác nhận mua hàng/thanh toán thành công (đối với khách tại website). Về quy trình đổi trả, nếu khiếu nại của bạn thoả mãn điều kiện, xin vui lòng liên hệ về email info@Pengoo.store để chúng tôi tiến hành đổi trả trong vòng 7 ngày làm việc.\n
                    Chi tiết về chính sách bảo hành của Pengoo tại đây.`}
        imageOnRight
        />
      
      <BlogSection />
      
    </Layout>
  );
};

export default Commitmentage;
