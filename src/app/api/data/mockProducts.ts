// src/data/mockProducts.ts
import { ProductFeature } from '@/app/types/product';

export const mockFeatureSections: ProductFeature[] = [
  {
    id: 1,
    name: "design",
    title: "Thiết kế tinh tế",
    description: "Sản phẩm được thiết kế với phong cách hiện đại, tinh tế, phù hợp với mọi không gian sống.",
    image: "/Banner_GoD_4000x2000_min.webp",
    content: "Thiết kế tinh tế, hiện đại",
    icon: "design",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "material",
    title: "Chất liệu cao cấp",
    description: "Làm từ chất liệu cao cấp, bền đẹp theo thời gian, thân thiện với môi trường.",
    image: "/Banner_GoD_4000x2000_min.webp",
    content: "Chất liệu cao cấp, bền đẹp",
    icon: "material",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "maintenance",
    title: "Dễ dàng vệ sinh",
    description: "Bề mặt chống bám bẩn, dễ dàng vệ sinh và bảo quản.",
    image: "/Banner_GoD_4000x2000_min.webp",
    content: "Dễ dàng vệ sinh và bảo quản",
    icon: "maintenance",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockMainIntro = {
  title: 'Thông tin nổi bật',
  description: 'Được chọn lọc và thiết kế dành riêng cho bạn.'
};