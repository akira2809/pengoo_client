// src/components/layouts/Policy/PromotionPolicyContent.tsx
import React from 'react';
import Image from 'next/image';

const PromotionContent: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-gray-800 leading-relaxed space-y-6">
      <h2 className="text-3xl font-bold mb-4">Chính Sách Khuyến Mãi</h2>
      <p>
        Pengoo luôn mong muốn mang đến trải nghiệm mua sắm tốt nhất cùng những ưu đãi đặc biệt dành cho khách hàng. 
        Dưới đây là thông tin chi tiết về các chính sách khuyến mãi hiện hành:
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Mã Giảm Giá 10% – Ưu Đãi Đơn Hàng Đầu Tiên</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Khách hàng khi đăng ký sẽ nhận được mã giảm 10% cho đơn hàng đầu tiên tại Pengoo.</li>
        <li>Mỗi khách hàng chỉ sử dụng được 1 lần duy nhất cho mã này.</li>
        <li>Không áp dụng đồng thời với các chương trình khuyến mãi khác (ví dụ: Ngày của Cha, lễ Tết, ưu đãi theo mùa…).</li>
        <li>Mã giảm giá chỉ áp dụng trên giá trị sản phẩm, không bao gồm:
          <ul className="list-disc pl-6 space-y-1">
            <li>Phí vận chuyển</li>
            <li>Phí gói quà</li>
            <li>Dịch vụ khắc tên / cá nhân hóa</li>
            <li>Các phụ phí khác (nếu có)</li>
          </ul>
        </li>
      </ul>
      <Image 
        src="/BannerSPD.avif" 
        alt="Khuyến mãi Pengoo" 
        width={800}
        height={400}
        className="rounded-xl shadow-md mb-4"
      />  

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Các Chương Trình Khuyến Mãi Khác</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Pengoo thường xuyên triển khai các ưu đãi đặc biệt theo dịp lễ, mùa sự kiện hoặc chương trình tri ân khách hàng.</li>
        <li>Mỗi đơn hàng chỉ áp dụng 1 chương trình khuyến mãi duy nhất tại một thời điểm.</li>
        <li>Các sản phẩm nằm trong danh sách khuyến mãi sẽ không áp dụng thêm mã giảm giá khác.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Điều Khoản Chung</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Mã khuyến mãi có thể đi kèm hạn sử dụng và sẽ không có hiệu lực nếu đã quá hạn hoặc bị hủy theo điều khoản.</li>
        <li>Pengoo có quyền điều chỉnh, thay đổi hoặc chấm dứt chương trình ưu đãi mà không cần thông báo trước.</li>
        <li>Trong trường hợp phát sinh lỗi kỹ thuật hoặc gian lận, Pengoo giữ quyền từ chối áp dụng khuyến mãi với đơn hàng liên quan.</li>
      </ul>

      <p className="mt-6 italic text-center text-lg">
        🎉 Cảm ơn bạn đã lựa chọn Pengoo – nơi hội tụ của nghệ thuật, sáng tạo và giá trị tinh thần trong từng sản phẩm!
      </p>
    </section>
  );
};

export default PromotionContent;
