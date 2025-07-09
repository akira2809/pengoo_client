// components/ProductForm.tsx
'use client';
import { useState } from 'react';

export default function ProductForm() {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [detailImages, setDetailImages] = useState<File[]>([]);
  const [featuredImages, setFeaturedImages] = useState<{ image: File; ord: number; title: string; content: string }[]>([]);

  const handleAddFeatured = () => {
    setFeaturedImages([...featuredImages, { image: null as any, ord: featuredImages.length + 1, title: "tét", content: "tét luôn" }]);
  };

  const handleFeaturedChange = (index: number, file: File, ord: number) => {
    const updated = [...featuredImages];
    updated[index] = { ...updated[index], image: file, ord };
    setFeaturedImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('features', JSON.stringify(featuredImages.map(f => ({
      title: f.title,
      content: f.content,
      ord: String(f.ord)
    }))));
    featuredImages.forEach((f, i) => {
      if (f.image) {
        formData.append('featureImages[]', f.image);
      }
    });
    formData.append('file', mainImage as Blob);

    detailImages.forEach((file) => {
      formData.append('images', file);
    });

    formData.append("product_name", "Majestic Mahjong Setsssssssssssssssssssssssssssss")
    formData.append("product_price", "2222")
    formData.append("description", "Lấy cảm hứng từ vẻ đẹp huyền bí của những đền tháp cổ Á Đông, Majestic Mahjong Set tái hiện tinh hoa văn hoá qua từng nét chạm khắc tinh xảo. Một tác phẩm nghệ thuật giao thoa giữa lịch sử và nghệ thuật, bộ cờ vừa toát lên vẻ cổ kính uy nghi, vừa tạo dấu ấn độc bản cho trải nghiệm chơi và trưng bày.")
    formData.append("slug", "skibidi mambo")
    formData.append("tags", "1 3 4")
    formData.append("discount", "0")
    formData.append("category_ID", "2")
    formData.append("publisher_ID", "1")
    formData.append("quantity_sold", "0")
    formData.append("quantity_stock", "10")
    formData.append("meta_description", "Mua Uno Flip chính hãng - phiên bản đặc biệt với hai mặt bài đảo chiều. Tăng độ kịch tính, chơi nhóm siêu vui. Giao hàng nhanh toàn quốc!")
    formData.append("meta_title", "shreriff of nothingham")
    formData.append("status", "Available")

    const res = await fetch('http://localhost:3000/products', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log('Response:', data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label>Main Image:</label>
        <input type="file" name="file" accept="image/*" onChange={(e) => setMainImage(e.target.files?.[0] ?? null)} />
      </div>

      <div>
        <label>Detail Images:</label>
        <input type="file" name="images" accept="image/*" multiple onChange={(e) => setDetailImages(Array.from(e.target.files ?? []))} />
      </div>

      <div>
        <label>Featured Images:</label>
        {featuredImages.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFeaturedChange(index, e.target.files?.[0] ?? (item.image as any), item.ord)
              }
            />
            <input
              type="number"
              placeholder="Order"
              value={item.ord}
              onChange={(e) =>
                handleFeaturedChange(index, item.image, Number(e.target.value))
              }
            />
          </div>
        ))}
        <button type="button" onClick={handleAddFeatured} className="bg-blue-500 text-white px-2 py-1 rounded">
          + Add Featured Image
        </button>
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
