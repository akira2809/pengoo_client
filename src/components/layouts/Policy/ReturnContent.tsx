// src/components/layouts/Policy/ShippingContent.tsx
import React from 'react';

const ReturnContent: React.FC = () => {
return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-gray-800 leading-relaxed space-y-6">
      <p>
        Mọi trường hợp khiếu nại sản phẩm sau khi nhận, vui lòng liên hệ email&nbsp;
        <a href="mailto:pengooservice@gmail.vn" className="text-blue-600 underline">pengooservice@gmail.vn</a>&nbsp;
        để được hỗ trợ.
      </p>

      <h2 className="text-3xl font-bold mt-6 mb-4">Điều kiện bảo hành</h2>
      <ol className="list-decimal pl-6 space-y-2">
        <li>
          Sản phẩm cần được bảo hành là hàng hóa do <strong>Pengoo</strong> sản xuất, có đầy đủ logo và bao bì thương hiệu chính hãng.
        </li>
        <li>
          Với hàng hóa lỗi do nhà sản xuất hoặc giao sai sản phẩm, khách hàng có thể yêu cầu đổi/trả trong vòng <strong>2 ngày</strong> kể từ khi nhận hàng. 
          Sau thời gian này, nếu sản phẩm vẫn còn hạn bảo hành, Pengoo sẽ hỗ trợ sửa chữa miễn phí (không áp dụng đổi trả).
        </li>
        <li>
          Khi bảo hành, khách hàng cần cung cấp:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Hóa đơn thanh toán (đối với khách mua tại cửa hàng).</li>
            <li>Email xác nhận giao hàng hoặc mã vận đơn (đối với khách mua online).</li>
            <li>Hình ảnh sản phẩm bị lỗi do nhà sản xuất.</li>
          </ul>
        </li>
        <li>
          Pengoo có quyền từ chối đổi trả nếu sản phẩm không đáp ứng các điều kiện trên.
        </li>
        <li>
          Thời hạn bảo hành: <strong>12 tháng</strong> kể từ ngày mua hàng.
        </li>
        <li>
          Các trường hợp không được bảo hành bao gồm:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Hư hỏng do rơi rớt, gãy vỡ, cháy nổ hoặc tác động vật lý.</li>
            <li>Sản phẩm bị thấm nước.</li>
            <li>Lỗi phát sinh không liên quan đến nhà sản xuất.</li>
          </ul>
          Khách hàng chịu toàn bộ chi phí sửa chữa/thay mới trong các trường hợp này.
        </li>
      </ol>

      <h2 className="text-3xl font-bold mt-8 mb-4">Quy trình bảo hành</h2>
      <p>
        Nếu khiếu nại đáp ứng đủ điều kiện, Pengoo sẽ xử lý theo lựa chọn của khách hàng:
      </p>

      <h3 className="text-xl font-semibold mt-4">1. Hoàn trả sản phẩm</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Thời gian xử lý hoàn trả: <strong>10–15 ngày làm việc</strong> kể từ ngày nhận được khiếu nại.</li>
        <li>Phương thức hoàn trả: <strong>chuyển khoản</strong> vào tài khoản của khách hàng.</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6">2. Đổi sản phẩm</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Thời gian xử lý đổi hàng: <strong>1–7 ngày làm việc</strong>, tùy khu vực giao hàng.</li>
        <li>
          Khách hàng gửi lại sản phẩm lỗi đến địa chỉ do Pengoo hướng dẫn. 
          Pengoo sẽ gửi sản phẩm mới và <strong>chịu chi phí vận chuyển hai chiều</strong>.
        </li>
      </ul>
    </section>
  );
};

export default ReturnContent;