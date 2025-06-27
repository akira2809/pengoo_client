// src/components/layouts/Policy/ShippingContent.tsx
import React from 'react';

const ShippingContent: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-gray-800 leading-relaxed space-y-6">
      <h2 className="text-3xl font-bold mb-4">Chi phí vận chuyển</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          Mức phí <strong>25.000 VND</strong> cho các đơn hàng <strong>nội thành TP.HCM</strong>. 
          Trường hợp vận chuyển nhanh trong 24 giờ, vui lòng liên hệ với Pengoo để biết phí cụ thể.
        </li>
        <li>
          Mức phí <strong>40.000 VND</strong> cho các đơn hàng <strong>trên toàn quốc</strong>. 
          Áp dụng cho các kênh mua hàng online khác của Pengoo.
        </li>
        <li>
          Miễn phí vận chuyển chỉ áp dụng với hình thức giao hàng thông thường, 
          <strong>không áp dụng cho giao hàng nhanh hoặc hỏa tốc</strong>.
        </li>
      </ul>

      <p className="italic text-sm text-gray-600">
        *Lưu ý: Mức giá trên áp dụng cho các kênh mua hàng online khác của Maztermind.
      </p>

      <h2 className="text-3xl font-bold mt-8 mb-4">Thời gian vận chuyển</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Nội thành TP.HCM:</strong> 2–3 ngày làm việc sau khi Maztermind xác nhận đơn hàng.
        </li>
        <li>
          <strong>Ngoại thành TP.HCM:</strong> 5–7 ngày làm việc. Thời gian có thể thay đổi tùy địa chỉ cụ thể.
        </li>
      </ul>

      <h3 className="text-3xl font-semibold mt-6 mb-2">Trường hợp giao hàng chậm trễ</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          Nếu lý do chậm trễ do Maztermind, khách hàng sẽ được <strong>miễn phí vận chuyển</strong>.
        </li>
        <li>
          Những trường hợp như: không liên lạc được, cung cấp thiếu thông tin, khách từ chối nhận hàng — 
          <strong>khách hàng tự chịu trách nhiệm</strong>.
        </li>
      </ul>
    </section>
  );
};

export default ShippingContent;