// app/layout.tsx
import "./globals.css";
import Header from "../components/layouts/Header/Header";
import Footer from "../components/layouts/Footer/Footer"; // Đảm bảo đã import Footer
import { Roboto } from "next/font/google";
import Chatbot from '@/components/Chatbot/Chatbot';
import { Metadata, Viewport } from "next"; // Import Viewport type từ next
import { Toaster } from 'react-hot-toast';

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

// Cập nhật Metadata chung cho toàn bộ trang web của PENGOO
export const metadata: Metadata = {
  title: {
    template: '%s | PENGOO Board Game', // Tạo template cho tiêu đề động
    default: 'PENGOO - Board Game Cho Gia Đình & Bạn Bè | Trải Nghiệm Giải Trí Đỉnh Cao', // Tiêu đề mặc định cho trang chủ
  },
  description: 'PENGOO chuyên cung cấp các loại board game, trò chơi gia đình và đồ chơi trí tuệ độc đáo. Khám phá ngay để có những khoảnh khắc giải trí và gắn kết tuyệt vời!',
  applicationName: 'PENGOO',
  creator: 'Tên nhà phát triển hoặc công ty của bạn', // Thay thế
  publisher: 'PENGOO',
  metadataBase: new URL('https://yourwebsite.com'), // Thay bằng URL cơ sở của bạn
  keywords: [
    'PENGOO', 'board game', 'trò chơi board game', 'board game gia đình', 
    'board game bạn bè', 'đồ chơi trí tuệ', 'trò chơi giải trí', 
    'game chiến thuật', 'game giáo dục', 'mua board game', 'cửa hàng board game', 
    'quà tặng board game', 'trò chơi nhóm', 'gắn kết gia đình'
  ],
  openGraph: {
    title: 'PENGOO - Board Game Cho Gia Đình & Bạn Bè',
    description: 'Khám phá bộ sưu tập board game độc đáo tại PENGOO.',
    url: 'https://yourwebsite.com', // URL trang chủ của bạn
    siteName: 'PENGOO',
    images: [
      {
        url: 'https://yourwebsite.com/images/opengraph-image.jpg', // Ảnh Open Graph chung
        width: 1200,
        height: 630,
        alt: 'PENGOO - Board Game cho Gia đình và Bạn bè',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourtwitterhandle', // Thay bằng Twitter handle của bạn
    creator: '@yourtwitterhandle',
    title: 'PENGOO - Board Game Cho Gia Đình & Bạn Bè',
    description: 'Khám phá bộ sưu tập board game độc đáo tại PENGOO.',
    images: ['https://yourwebsite.com/images/twitter-image.jpg'], // Ảnh Twitter Card chung
  },
  // Thêm manifest link ở đây
  manifest: '/site.webmanifest', 
};

// ĐỊNH NGHĨA EXPORT VIEWPORT RIÊNG BIỆT
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1A202C', // Màu theme cho ứng dụng (ví dụ: màu tối của header)
  colorScheme: 'light', // Hoặc 'light dark' nếu bạn hỗ trợ cả hai
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${roboto.className} antialiased bg-background-50 text-gray-900`}>
        <Header />
        <main className="relative">
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#4CAF50',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              },
              success: {
                iconTheme: {
                  primary: '#fff',
                  secondary: '#4CAF50',
                },
              },
            }}
          />
          {children}
        </main>
        <Chatbot />
        <Footer />
      </body>
    </html>
  );
}