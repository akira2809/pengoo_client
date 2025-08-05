// app/layout.tsx
import "./globals.css";
import Footer from "../components/layouts/Footer/Footer";
import { Roboto } from "next/font/google";
import Chatbot from '@/components/Chatbot/Chatbot';
import { Metadata, Viewport } from "next";
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import HeaderWrapper from "@/components/layouts/Header/HeaderWrapper";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

// Cập nhật Metadata chung cho toàn bộ trang web của PENGOO
export const metadata: Metadata = {
  title: {
    template: '%s | PENGOO Board Game',
    default: 'PENGOO - Board Game Cho Gia Đình & Bạn Bè | Trải Nghiệm Giải Trí Đỉnh Cao',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', rel: 'icon' },
      { url: '/logopengoo2.png', sizes: '32x32', type: 'image/png' },
      { url: '/logopengoo2.png', sizes: '16x16', type: 'image/png' },
      { url: '/logopengoo2.png', sizes: '192x192', type: 'image/png' },
      { url: '/logopengoo2.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/logopengoo2.png' }
    ],
    shortcut: ['/favicon.ico'],
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/logopengoo2.png',
      },
    ],
  },
  description: 'PENGOO chuyên cung cấp các loại board game, trò chơi gia đình và đồ chơi trí tuệ độc đáo. Khám phá ngay để có những khoảnh khắc giải trí và gắn kết tuyệt vời!',
  applicationName: 'PENGOO',
  creator: 'PENGOO',
  publisher: 'PENGOO',
  metadataBase: new URL('https://pengoo.store'),
  keywords: [
    'PENGOO', 'board game', 'trò chơi board game', 'board game gia đình', 
    'board game bạn bè', 'đồ chơi trí tuệ', 'trò chơi giải trí', 'board game Việt Nam',
    'đồ chơi phát triển tư duy', 'game board', 'trò chơi nhập vai', 'board game nhập khẩu',
    'board game trẻ em', 'trò chơi tập thể', 'đồ chơi giáo dục', 'board game phát triển kỹ năng'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'PENGOO - Board Game Cho Gia Đình & Bạn Bè',
    description: 'Khám phá bộ sưu tập board game đa dạng tại PENGOO. Trải nghiệm những trò chơi thú vị dành cho gia đình và bạn bè với chất lượng tốt nhất.',
    url: 'https://pengoo.store',
    siteName: 'PENGOO',
    images: [
      {
        url: 'https://pengoo.store/images/opengraph-image.jpg',
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
    images: ['https://pengoo.store/images/twitter-image.jpg'], // Ảnh Twitter Card chung
  },
  // Thêm manifest link ở đây
  manifest: '/site.webmanifest',
  // Đã chuyển cấu hình viewport và themeColor ra ngoài metadata
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'light dark',
};

export const themeColor = [
  { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  { media: '(prefers-color-scheme: dark)', color: '#1A202C' },
];


const No_Header_Paths = [
  '/checkout'
];


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta name="apple-mobile-web-app-title" content="Pengoo" />
        {/* Google tag (gtag.js) */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-P71X7PPDKC" 
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P71X7PPDKC');
          `}
        </Script>
      </head>
      <body className={`${roboto.className} antialiased bg-background-50 text-gray-900`}>
        <HeaderWrapper noHeaderPaths={No_Header_Paths} />
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