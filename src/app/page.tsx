// app/page.tsx
import HeroBanner from '../components/common/HomePage/HeroBanner'; // Đảm bảo đường dẫn đúng

export default function HomePage() {
  const bannerFeatures = [
    { iconSrc: '/icons/calming-effect.svg', alt: 'Calming Effect Icon', label: 'CALMING EFFECT' },
    { iconSrc: '/icons/alcohol-free.svg', alt: 'Alcohol-Free Icon', label: 'ALCOHOL-FREE' },
    { iconSrc: '/icons/superior-flavor.svg', alt: 'Superior Flavor Icon', label: 'SUPERIOR FLAVOUR' },
  ];

  return (
    <div>
      <HeroBanner
        backgroundImage="/images/collider_background.jpg" // Đảm bảo bạn có hình nền này
        productImage="/images/collider_can.png" // Đảm bảo bạn có hình ảnh lon sản phẩm này
        title="Mood-boosting beer without the alcohol"
        description="Non-alcoholic beer infused with functional mushrooms and botanicals to relax you without the need for alcohol."
        features={bannerFeatures}
        buttonText="SHOP NOW"
        buttonLink="/shop"
        rating="4.8/5 FROM 800+ REVIEWS"
      />

      {/* Phần còn lại của nội dung trang chủ */}
    </div>
  );
}