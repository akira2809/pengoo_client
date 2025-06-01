// src/data/productData.ts
import { ProductData, ProductFeature } from '@/app/type/product';

export const mainIntroData = {
  title: "Niềm Vui Nhận Theo Từng Phút Giây",
  description: "Bộ bài ngẫu nhiên một là bài và đã niềm vui hội ngộ bùng nổ một cách tự nhiên nhất! Từ những lá bài chỉ định uống đơn thuần, hay những nhiệm vụ đơn giản, đến các thử thách và câu hỏi 'tạo bạo' khi mọi người dần trở nên thân thiết, Game of Drunks mang trong mình những chủ đề dạng phù hợp với bất cứ ai. Dù bạn là người ngại ngùng hay luôn sẵn sàng chơi hết mình, tất cả đều có thể nhập cuộc và tận hưởng trọn vẹn khoảnh khắc khác biến nhau!",
};

export const featureSections: ProductFeature[] = [
  {
    title: "Khởi Động Nhẹ Nhàng",
    description: "Đôi khi trong một buổi 'nhậu', chúng ta tự động giãn chill muốn cùng nhau nâng ly để khuấy động bầu không khí...",
    imageSrc: "/Website_ProductDes2_min.webp",
    imageAlt: "Game of Drunks Cards - Broken Heart",
    textBgColor: "#f8f6f1",
    isImageRight: true,
    isFirstBlock: true,
  },
  {
    title: "Những Trò Chơi Gắn Kết",
    description: "Thế nhưng, chỉ uống thôi làm sao gắn kết được với nhau?...",
    imageSrc: "/Website_ProductDes2_min.webp",
    imageAlt: "Game of Drunks Cards - Clap Hands",
    textBgColor: "#f8f6f1",
    isImageRight: false,
  },
  {
    title: "Nâng Cấp Cuộc Vui",
    description: "Khi 'men' chớm đã dần ngấm, cuộc vui cũng dần kéo dài...",
    imageSrc: "/Website_ProductDes2_min.webp",
    imageAlt: "Game of Drunks Cards - Worst Place",
    textBgColor: "#f8f6f1",
    isImageRight: true,
  },
];

export const productData: ProductData = {
  id: "1",
  slug: "game-of-drunks",
  name: "Game of Drunks",
  originalPrice: 295000,
  discountedPrice: 236000,
  description: `Được nâng tầm và chọn lọc nội dung từ những trò tuyệt nhất Mastermind. Game of Drunks là chìa khóa để khuyấy động mọi buổi tụ tập. Với 100 lá bài thú vị, "lộ bộ" những bí mật thầm kín đến các thử thách hài hước khó đỡ, bạn sẽ phải lựa chọn dám nói, dám làm, hay... nhập một ngụm? Dù là hai bạn thân lâu năm hay lần đầu gặp mặt, Game of Drunks xoá tan khoảng cách và kết nối mọi người qua tiếng cười sảng khoái cùng những tin cưng ly đầy cảm xúc!`,
  features: [
    "Dựa trên trò chơi Mastermind",
    "100 lá bài độc đáo và thú vị",
    "Phù hợp cho mọi buổi tụ tập",
    "Xóa tan khoảng cách, tăng cường kết nối",
    "Mang lại tiếng cười sảng khoái và cảm xúc",
  ],
  warranty: "Bảo hành 12 tháng",
  shippingInfo: "Miễn phí vận chuyển",
  images: [
    { src: "/MM_GameofDrunks_1 (1).webp", alt: "Game of Drunks Main Image" },
    { src: "/board-game-card-design_699907-1.webp", alt: "Game of Drunks hộp ngoài" },
    { src: "/craftsmanship-2-3200x1600.jpg", alt: "Game of Drunks mở hộp" },
    { src: "/MM_GameofDrunks_1 (1).webp", alt: "Game of Drunks Main Image" },
    { src: "/board-game-card-design_699907-1.webp", alt: "Game of Drunks hộp ngoài" },
    { src: "/craftsmanship-2-3200x1600.jpg", alt: "Game of Drunks mở hộp" },
  ],
};


export const DUMMY_PRODUCTS: ProductData[] = [
  // Sản phẩm Bầu Cua Khai Xuân
  {
    id: 'bau-cua-khai-xuan',
    slug: 'bau-cua-khai-xuan',
    name: 'Bầu Cua Khai Xuân',
    originalPrice: 1200000,
    discountedPrice: 999000,
    description: 'Bộ Bầu Cua Khai Xuân với thiết kế truyền thống, mang đến không khí Tết ấm cúng và những giây phút giải trí sôi động cho gia đình và bạn bè.',
    features: ['Thiết kế truyền thống', 'Chất liệu cao cấp', 'Dễ dàng di chuyển'],
    warranty: '12 tháng',
    shippingInfo: 'Giao hàng toàn quốc',
    images: [
      { src: '/craftsmanship-2-3200x1600.jpg', alt: 'Bầu Cua Khai Xuân' },
      { src: '/MM_BoxSet4_2-min.png', alt: 'Bầu Cua Khai Xuân (hover)' }, // Tạo ảnh hover nếu có
    ],
    category: 'board_games', // Thêm category
    isOutOfStock: false,
    discount: '20% OFF', // Thêm discount text
  },
  // Sản phẩm Bầu Cua Lộc Uyên
  {
    id: 'bau-cua-loc-uyen',
    slug: 'bau-cua-loc-uyen',
    name: 'Bầu Cua Lộc Uyên',
    originalPrice: 1500000,
    discountedPrice: 1299000,
    description: 'Bầu Cua Lộc Uyên được chế tác tinh xảo, với hình ảnh các con vật sống động, hứa hẹn mang lại may mắn và tài lộc trong năm mới.',
    features: ['Chế tác thủ công', 'Hình ảnh sắc nét', 'Bền đẹp'],
    warranty: '12 tháng',
    shippingInfo: 'Giao hàng toàn quốc',
    images: [
      { src: '/products/bau-cua-loc-uyen.jpg', alt: 'Bầu Cua Lộc Uyên' },
      { src: '/products/bau-cua-loc-uyen-hover.jpg', alt: 'Bầu Cua Lộc Uyên (hover)' }, // Tạo ảnh hover nếu có
    ],
    category: 'board_games',
    isOutOfStock: false,
    discount: '15% OFF',
  },
  // Game of Drunks
  {
    id: 'game-of-drunks',
    slug: 'game-of-drunks',
    name: 'Game of Drunks',
    originalPrice: 295000,
    discountedPrice: 236000,
    description: 'Bộ bài Game of Drunks để khuấy động mọi buổi tụ tập.',
    features: ['Bộ bài uống rượu', 'Luật chơi đơn giản', 'Nhiều thử thách'],
    warranty: '6 tháng',
    shippingInfo: 'Giao hàng nhanh',
    images: [
      { src: '/images/game-of-drunks-box.png', alt: 'Game of Drunks Box' },
      { src: '/images/game-of-drunks-cards.png', alt: 'Game of Drunks Cards' },
    ],
    category: 'drink_games',
    isOutOfStock: false,
    discount: '20% OFF',
  },

  // Thêm các sản phẩm dummy khác tại đây
];
