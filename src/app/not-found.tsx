import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <h1 className="text-9xl font-bold text-gray-800">404</h1>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Trang không tìm thấy
        </h2>
        <p className="mt-2 text-gray-600">
          Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
          >
            Quay về trang chủ
          </Link>
        </div>
        <div className="mt-12">
          <div className="relative w-full h-64 flex items-center justify-center">
            {/* SVG illustration with fallback */}
            <div className="w-full h-full flex items-center justify-center">
              <svg
                width="256"
                height="256"
                viewBox="0 0 256 256"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="max-w-full max-h-full text-gray-400"
              >
                {/* Simple 404 illustration */}
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M88 112c0-8.837 7.163-16 16-16s16 7.163 16 16-7.163 16-16 16-16-7.163-16-16z"
                  fill="currentColor"
                />
                <path
                  d="M136 112c0-8.837 7.163-16 16-16s16 7.163 16 16-7.163 16-16 16-16-7.163-16-16z"
                  fill="currentColor"
                />
                <path
                  d="M96 160c0-17.673 14.327-32 32-32s32 14.327 32 32"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <text
                  x="128"
                  y="200"
                  textAnchor="middle"
                  className="text-sm fill-current font-medium"
                >
                  Không tìm thấy
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
