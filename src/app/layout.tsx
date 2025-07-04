// app/layout.tsx
import "./globals.css";
import Header from "../components/layouts/Header/Header";
import Footer from "../components/layouts/Footer/Footer"; // Đảm bảo đã import Footer
import { Roboto,  } from "next/font/google";
import Chatbot from '@/components/Chatbot/Chatbot';
// const robotoSlab = Roboto_Slab({ subsets: ["latin"] });
import { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});
export const metadata: Metadata = {
  title: "Pengoo",
  description: "A Next.js application with a parallax effect",

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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