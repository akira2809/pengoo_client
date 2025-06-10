// src/data/mockProducts.ts
import { ProductData, ProductFeature } from '@/app/type/product';

export const mockFeatureSections: ProductFeature[] = [
  {
    title: "Thiết kế tinh tế",
    description: "Sản phẩm được thiết kế với phong cách hiện đại, tinh tế, phù hợp với mọi không gian sống.",
    imageSrc: "/Banner_GoD_4000x2000_min.webp",
    imageAlt: "Thiết kế sản phẩm",
    textBgColor: "#f9fafb",
    isImageRight: true,
    isFirstBlock: true
  },
  {
    title: "Chất liệu cao cấp",
    description: "Làm từ chất liệu cao cấp, bền đẹp theo thời gian, thân thiện với môi trường.",
    imageSrc: "/Banner_GoD_4000x2000_min.webp",
    imageAlt: "Chất liệu sản phẩm",
    textBgColor: "#f3f4f6",
    isImageRight: false
  },
  {
    title: "Dễ dàng vệ sinh",
    description: "Bề mặt chống bám bẩn, dễ dàng vệ sinh và bảo quản.",
    imageSrc: "/Banner_GoD_4000x2000_min.webp",
    imageAlt: "Dễ vệ sinh",
    textBgColor: "#f9fafb",
    isImageRight: true
  }
];

export const mockMainIntro = {
  title: 'Thông tin nổi bật',
  description: 'Được chọn lọc và thiết kế dành riêng cho bạn.'
};