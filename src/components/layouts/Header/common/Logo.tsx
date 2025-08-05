import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold flex items-center z-10">
      <Link href="/" aria-label="Go to homepage" className="flex items-center">
        <div className="w-[300px] h-auto">
          <Image
            src="/logonav.png"      // ảnh phải có trong /public
            alt="Pengoo"
            width={300}
            height={35}
            priority                 // tối ưu LCP cho logo
            className="w-full h-auto"
          />
        </div>
      </Link>
    </div>
  );
}
