// components/HomePage/HeroBanner.tsx
import Image from 'next/image';

interface HeroBannerProps {
  backgroundImage: string;
  productImage: string;
  title: string;
  description: string;
  features: { iconSrc: string; alt: string; label: string; }[];
  buttonText: string;
  buttonLink: string;
  rating: string;
}

export default function HeroBanner({
  backgroundImage,
  productImage,
  title,
  description,
  features,
  buttonText,
  buttonLink,
  rating,
}: HeroBannerProps) {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="Banner Background"
        layout="fill"
        objectFit="cover"
        quality={80}
        priority
        className="z-0"
      />

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between p-4 md:p-8 lg:p-16 max-w-7xl mx-auto">
        {/* Left Content (Text and Features) */}
        <div className="text-white text-left md:w-1/2 lg:w-2/5 xl:w-1/3 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-base md:text-lg mb-6 max-w-md">
            {description}
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-start">
                {/* Bạn có thể thay iconSrc bằng một component Icon nếu có */}
                <Image
                  src={feature.iconSrc}
                  alt={feature.alt}
                  width={32}
                  height={32}
                  className="mb-2 filter brightness-0 invert" // Làm icon trắng nếu nền tối
                />
                <span className="text-sm md:text-base font-semibold">{feature.label}</span>
              </div>
            ))}
          </div>
          <a href={buttonLink} className="inline-flex items-center bg-black text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors">
            {buttonText}
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </a>
          <p className="mt-4 text-sm md:text-base font-semibold">{rating}</p>
        </div>

        {/* Right Content (Product Image) */}
        <div className="flex justify-center items-center md:w-1/2 lg:w-3/5 xl:w-2/3">
          <Image
            src={productImage}
            alt="Product"
            width={400} // Điều chỉnh kích thước sản phẩm
            height={600} // Điều chỉnh kích thước sản phẩm
            objectFit="contain"
            quality={90}
            className="drop-shadow-2xl" // Tạo hiệu ứng đổ bóng
          />
        </div>
      </div>
    </div>
  );
}