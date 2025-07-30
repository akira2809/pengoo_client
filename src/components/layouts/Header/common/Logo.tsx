// components/Header/common/Logo.tsx
import Link from 'next/link';

export default function Logo() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold flex items-center z-10">
      <Link href="/" aria-label="Go to homepage" className="flex items-center">
        <div className="w-[300px] h-auto">
          {/* Using img tag instead of Next.js Image for SVG */}
          <img
            src="/logo-01.svg"
            alt="Logo"
            width="300"
            height="auto"
            className="w-full h-auto"
          />
        </div>
      </Link>
    </div>
  );
}