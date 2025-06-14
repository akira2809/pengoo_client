'use client';

import { useState } from 'react';

export default function CreateProductForm() {
  const [features, setFeatures] = useState([{ title: '', content: '', image: null }]);

  const handleFeatureChange = (index: number, key: string, value: any) => {
    const updated = [...features];
    updated[index][key] = value;
    setFeatures(updated);
  };

  const addFeature = () => {
    setFeatures([...features, { title: '', content: '', image: null }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // 👇 Append fixed product fields
    formData.append("product_name", "cate2");
    formData.append("product_price", "22222");
    formData.append("description", "Lấy cảm hứng từ vẻ đẹp huyền bí của những đền tháp cổ Á Đông, Majestic Mahjong Set tái hiện tinh hoa văn hoá qua từng nét chạm khắc tinh xảo. Một tác phẩm nghệ thuật giao thoa giữa lịch sử và nghệ thuật, bộ cờ vừa toát lên vẻ cổ kính uy nghi, vừa tạo dấu ấn độc bản cho trải nghiệm chơi và trưng bày.");
    formData.append("slug", "domino-skibidi");
    formData.append("tags", "Party 2-4 Short");
    formData.append("discount", "0");

    // 👇 Đây là chỗ fix nè
    formData.append("categoryId", "2"); // Sửa ở đây: đảm bảo là "2" và đúng key backend cần

    formData.append("publisher_ID", "1");
    formData.append("quantity_sold", "0");
    formData.append("quantity_stock", "10");
    formData.append("meta_description", "Mua Uno Flip chính hãng - phiên bản đặc biệt với hai mặt bài đảo chiều. Tăng độ kịch tính, chơi nhóm siêu vui. Giao hàng nhanh toàn quốc!");
    formData.append("meta_title", "shreriff of nothingham");
    formData.append("status", "Available");

    // 👇 Append features
    formData.append('features', JSON.stringify(features.map(f => ({
      title: f.title,
      content: f.content
    }))));

    // 👇 Append feature images
    features.forEach((f, i) => {
      if (f.image) {
        formData.append('featureImages[]', f.image);
      }
    });

    // 👀 Kiểm tra trước khi gửi
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // 🔥 Gửi dữ liệu
    const res = await fetch('http://localhost:3000/products', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log('Server response:', data);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Thông tin sản phẩm</h2>

      <h3>Ảnh chính</h3>
      <input type="file" name="file" accept="image/*" required />

      <h3>Ảnh phụ</h3>
      <input type="file" name="images" multiple accept="image/*" />

      <h3>Features</h3>
      {features.map((feature, i) => (
        <div key={i} style={{ marginBottom: '1rem', border: '1px solid gray', padding: '1rem' }}>
          <input
            type="text"
            placeholder="Tiêu đề"
            value={feature.title}
            onChange={(e) => handleFeatureChange(i, 'title', e.target.value)}
          />
          <input
            type="text"
            placeholder="Nội dung"
            value={feature.content}
            onChange={(e) => handleFeatureChange(i, 'content', e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFeatureChange(i, 'image', e.target.files?.[0] || null)
            }
          />
        </div>
      ))}
      <button type="button" onClick={addFeature}>+ Thêm feature</button>

      <br /><br />
      <button type="submit">Tạo sản phẩm</button>
    </form>
  );
}
