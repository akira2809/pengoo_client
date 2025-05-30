// app/layout.tsx
import "./globals.css";
import Header from "../components/layouts/Header/Header";
import Footer from "../components/layouts/Footer/Footer"; // Đảm bảo đã import Footer
import { Roboto,  } from "next/font/google";
// const robotoSlab = Roboto_Slab({ subsets: ["latin"] });
import { Metadata } from "next";
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
      <body className={`${roboto.className} antialiased bg-background-100 text-gray-900`}>
        <Header />
        <main className="">
         
          {children}
  
        </main>
        <Footer />
      </body>
    </html>
  );
}