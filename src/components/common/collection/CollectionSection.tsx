import Image from "next/image";
import Link from "next/link";

interface CollectionItemProps {
  imageSrc: string;
  altText: string;
  title: string;
  href: string; // Đường dẫn khi click vào mục
}

// Component con cho từng mục trong bộ sưu tập
const CollectionItem: React.FC<CollectionItemProps> = ({ imageSrc, altText, title, href }) => {
  return (
    <Link href={href} className="group block relative w-full h-auto overflow-hidden rounded-lg shadow-lg">
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden">
        <Image
          src={imageSrc}
          alt={altText}
          fill // Sử dụng fill để ảnh lấp đầy container và dùng object-cover
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Tối ưu hóa ảnh cho các kích thước màn hình
          className="object-cover transition-transform duration-300 group-hover:scale-105" // Hiệu ứng zoom khi hover
          priority // Đặt priority nếu đây là ảnh quan trọng trên màn hình đầu tiên
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 py-4 px-6 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
        <h3 className="text-xl md:text-2xl font-semibold uppercase tracking-wider opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          {title}
        </h3>
      </div>
      {/* Overlay để tạo hiệu ứng hover mờ nhạt (tùy chọn) */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
    </Link>
  );
};

// Component chính cho phần Bộ sưu tập
export default function CollectionSection() {
  const collections = [
    {
      id: 1,
      imageSrc: "/signature.png", // Thay thế bằng đường dẫn ảnh thực tế của bạn
      altText: "Bộ sưu tập Signature",
      title: "SIGNATURE",
      href: "/signature.png",
    },
    {
      id: 2,
      imageSrc: "/signature.png", // Thay thế bằng đường dẫn ảnh thực tế của bạn
      altText: "Bộ sưu tập Lumina",
      title: "LUMINA",
      href: "/signature.png",
    },
    {
      id: 3,
      imageSrc: "/signature.png", // Thay thế bằng đường dẫn ảnh thực tế của bạn
      altText: "Bộ sưu tập Playing Cards",
      title: "PLAYING CARDS",
      href: "/signature.png",
    },
  ];

  return (
    // Đã áp dụng `max-w-screen-2xl mx-auto px-4 py-12 sm:px-6 lg:px-16` ở đây
    <section className="max-w-screen-2xl mx-auto px-4 py-12 sm:px-6 lg:px-16">
      {/* Đã áp dụng `flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0` ở đây */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-4xl md:text-5xl font-bold text-text-900 tracking-tight ">
          Bộ sưu tập
        </h2>
        <Link href="/collections" className="flex items-center text-lg text-gray-600 hover:text-gray-900 transition-colors duration-200 group">
          Xem tất cả
          <span className="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 group-hover:bg-gray-200 transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.map((item) => (
          <CollectionItem
            key={item.id}
            imageSrc={item.imageSrc}
            altText={item.altText}
            title={item.title}
            href={item.href}
          />
        ))}
      </div>
    </section>
  );
}