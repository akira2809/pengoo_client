import Link from 'next/link';
import Image from 'next/image';

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
          <div className="relative w-full h-64">
            <Image
              src="/404-illustration.svg"
              alt="404 Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
