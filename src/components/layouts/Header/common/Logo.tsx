// components/Header/common/Logo.tsx
import Link from 'next/link';

export default function Logo() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold flex items-center z-10">
      <Link href="/" aria-label="Go to homepage" className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 160 40"
          className="w-10 h-auto"
          fill="none"
        >
          {/* Ông có thể customize width/height bằng Tailwind ở đây */}
          {/* Bên dưới là nội dung SVG, tớ đã fix tất cả `class` thành `className` nếu có */}
          {/* Copy nội dung từ file SVG ông up vào đây */}

          {/* Ví dụ nhỏ (tớ sẽ thay bằng nội dung SVG thật của ông ở bước dưới): */}
          {/* <path d="M10 10 H 90 V 90 H 10 Z" fill="#000" /> */}

          {/* Nội dung SVG đầy đủ từ file ông upload đây: */}
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <path d="M19.59,26.5l-4.58,6.46h0a.42.42,0,0,1-.55.11h0l-2.47-1.55a.43.43,0,0,1-.15-.58l3.15-6Z" fill="#7eacb5" />
              <path d="M10.47,25.66l-5.9,8.35h0a.42.42,0,0,1-.55.11h0L1.55,32.57a.43.43,0,0,1-.15-.58l5.18-10.12Z" fill="#eba60f" />
              <path d="M34.66,11.18c0,4.5-3.94,11.24-6.17,14.82a52.2,52.2,0,0,1-4.66,6.23,28.8,28.8,0,0,1-4.2,3.74,9.68,9.68,0,0,1-1.65.93,4.73,4.73,0,0,1-1.48.39,2.3,2.3,0,0,1-1.58-.6A3.17,3.17,0,0,1,14.31,35a5.09,5.09,0,0,1-.24-2.44,6.79,6.79,0,0,1,.87-2.36,24.63,24.63,0,0,1,2.38-3.78c1.6-2.19,3.6-4.75,5.41-7.33,2.76-4,4.73-7.37,5.35-9.72A3.91,3.91,0,0,0,26,6.4a3.38,3.38,0,0,0-2.2-.72,5.41,5.41,0,0,0-3,.84,15.18,15.18,0,0,0-3.23,2.91,15.39,15.39,0,0,0-1.86,2.62,1.07,1.07,0,0,1-1.57.43h0l-2.38-1.57a.94.94,0,0,1-.3-1.29,18.25,18.25,0,0,1,1.87-2.71,17.93,17.93,0,0,1,3.89-3.88A11.88,11.88,0,0,1,24,1.15,8.88,8.88,0,0,1,29.61,2.4a7.62,7.62,0,0,1,2.3,2.4A7.25,7.25,0,0,1,33,7.52a10.28,10.28,0,0,1,1.63,3.66A13.52,13.52,0,0,1,34.66,11.18Z" fill="#c96868" />
              <path d="M35.15,31.5a5.18,5.18,0,1,1,5.18-5.18A5.18,5.18,0,0,1,35.15,31.5Z" fill="#eba712" />
            </g>
          </g>
        </svg>
      </Link>
    </div>
  );
}
