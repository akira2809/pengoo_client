// app/layout.tsx
import "./globals.css";
import Header from "../components/layouts/Header/Header";
import Footer from "../components/layouts/Footer/Footer"; // Đảm bảo đã import Footer
import { Roboto, Roboto_Slab } from "next/font/google";

const robotoSlab = Roboto_Slab({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Body bây giờ là flex container nhờ globals.css */}
      <body className={`${roboto.className} antialiased bg-secondary text-gray-900`}>
        {/* Header của bạn */}
        <Header />
        
        {/* Phần nội dung chính <main> sẽ giãn nở để đẩy Footer xuống */}
        <main className="pt-16 flex-grow"> {/* Đảm bảo có class flex-grow */}
          {children}
        </main>

        {/* Footer nằm ở cuối body */}
        <Footer />
      </body>
    </html>
  );
}