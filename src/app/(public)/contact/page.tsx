// app/(public)/contact/page.tsx
import { Metadata } from "next";
import ContactSection from "@/components/layouts/Contact/ContactSection";
import Layout from "@/components/common/UI/85%";
import { BlogSection } from "@/components/common/BlogSection";

// --- SEO: Định nghĩa Metadata cho trang Contact ---
export const metadata: Metadata = {
  title: "Liên Hệ PENGOO - Showroom & Thông Tin Liên Lạc | Board Game Store",
  description:
    "Liên hệ với PENGOO qua showroom tại TP.HCM. Địa chỉ: 6/10 Cách Mạng Tháng 8, P.Bến Thành, Q1. Hotline: 012345678. Trải nghiệm 30+ board games độc đáo và nhận ưu đãi hấp dẫn.",
  keywords: [
    "liên hệ PENGOO",
    "showroom PENGOO",
    "địa chỉ PENGOO",
    "hotline PENGOO",
    "showroom board game TP.HCM",
    "cửa hàng board game Quận 1",
    "trải nghiệm board game",
    "gói quà board game",
    "PENGOO Bến Thành",
    "board game store contact",
    "pengoo showroom",
    "liên lạc PENGOO",
  ],
  alternates: {
    canonical: "https://pengoo.store/contact",
  },
  openGraph: {
    title: "Liên Hệ PENGOO - Showroom Board Game TP.HCM",
    description:
      "Ghé thăm showroom PENGOO tại Quận 1, TP.HCM. Trải nghiệm 30+ board games độc đáo và nhận tư vấn từ chuyên gia.",
    url: "https://pengoo.store/contact",
    images: [
      {
        url: "https://pengoo.store/images/showroom-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PENGOO Showroom - Board Game Store TP.HCM",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liên Hệ PENGOO - Showroom Board Game TP.HCM",
    description:
      "Ghé thăm showroom PENGOO tại Quận 1, TP.HCM để trải nghiệm board games.",
    images: ["https://pengoo.store/images/showroom-twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Add JSON-LD structured data for contact/business info
function addContactJsonLd() {
  return {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "LocalBusiness",
      "name": "PENGOO Board Game Store",
      "description": "Cửa hàng board game hàng đầu tại TP.HCM với showroom trải nghiệm sản phẩm thực tế",
      "url": "https://pengoo.store",
      "telephone": "012345678",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "6/10 Cách Mạng Tháng 8",
        "addressLocality": "Phường Bến Thành, Quận 1",
        "addressRegion": "TP.HCM",
        "addressCountry": "VN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "10.7769",
        "longitude": "106.7009"
      },
      "openingHours": "Mo-Su 09:00-22:00",
      "priceRange": "$$",
      "image": "https://pengoo.store/images/showroom-image.jpg",
      "sameAs": [
        "https://facebook.com/pengoo.boardgame",
        "https://instagram.com/pengoo.boardgame"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Board Games Collection",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Board Games",
              "description": "Hơn 30 loại board game độc đáo"
            }
          }
        ]
      },
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Trải nghiệm sản phẩm",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification", 
          "name": "Gói quà miễn phí",
          "value": true
        }
      ]
    }`,
  };
}

// Add breadcrumb JSON-LD
function addBreadcrumbJsonLd() {
  return {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Trang chủ",
          "item": "https://pengoo.store"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Liên hệ",
          "item": "https://pengoo.store/contact"
        }
      ]
    }`,
  };
}
// --- Hết phần SEO ---

const ContactPage: React.FC = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={addContactJsonLd()}
        key="contact-jsonld"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={addBreadcrumbJsonLd()}
        key="breadcrumb-jsonld"
      />
      <Layout>
        <ContactSection
          imageUrl="/BannerZK.webp"
          altText="Showroom"
          title="Showroom"
          description={`<strong>Địa chỉ:</strong> 6/10 Cách Mạng Tháng 8, P.Bến Thành, Q1, TP.HCM\n
              <strong>Thời gian làm việc:</strong> 9:00 - 22:00\n
              <strong>Hotline:</strong> 012345678`}
        />

        <ContactSection
          imageUrl="/BannerMHWHunters.webp"
          altText="Gói quà miễn phí"
          title="Gói quà miễn phí"
          description={`Tận tay chọn món quà đầy tinh tế và sang trọng tại showroom để bạn gửi gắm tình cảm và sự quan tâm đến ai đó một cách trọn vẹn nhất.`}
          imageOnRight
        />

        <ContactSection
          imageUrl="/BannerDX.webp"
          altText="Trải nghiệm sản phẩm thực tế"
          title="Trải nghiệm sản phẩm thực tế"
          description={`Pengoo luôn tự hào với những người nghệ nhân Việt xuất chúng đã và đang làm ra các sản phẩm board games làm từ chất liệu hài hòa tạo nên giá trị bền vững, cùng vẻ đẹp tối giản thanh lịch.\n
                      Thông thường khách hàng chỉ có thể cảm nhận tâm huyết của họ qua các ấn phẩm trên trang mạng xã hội và website suốt 6 năm qua, nay <strong>Pengoo đã có showroom đầu tiên</strong> tại TP.HCM.\n
                      Hãy ghé ngay hôm nay và trải nghiệm <strong>30+ board games độc đáo</strong> tại 6/10 Cách Mạng Tháng 8, P.Bến Thành, Q1, TP.HCM và nhận nhiều ưu đãi hấp dẫn!`}
        />
        <BlogSection />
      </Layout>
    </>
  );
};

export default ContactPage;
