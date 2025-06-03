// app/about/AboutPageContent.tsx
"use client"; // Component này cũng là client component vì nó dùng useState

import React, { useState } from "react";

import AboutSection from "@/components/layouts/About/section/AboutSectionLeft";
import AboutTabs from "@/components/layouts/About/section/AboutTabs"; // Import component tab mới
import AboutSectionRight from "@/components/layouts/About/section/AboutSectionRight";
import CoreValuesSection from "@/components/layouts/About/section/CoreValuesSection";
import  Layout  from "@/components/UI/85%";
import TimelineSection from "@/components/layouts/About/section/TimelineSection";
import ShuffleHero from "@/components/layouts/About/section/ShuffleHero";

const AboutPageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("maztermind"); // State để theo dõi tab đang hoạt động

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };
  const coreValuesData = [
    {
      iconUrl: "/hihi1.webp", // THAY BẰNG ĐƯỜNG DẪN ẢNH THẬT
      title: "Nghệ thuật thủ công",
      description:
        "“Nghệ thuật thủ công” là một trong những giá trị cốt lõi tạo nên tên tuổi của Maztermind. Từ việc xử lý vật liệu thô thành một sản phẩm chất lượng cao, quy trình chế tác của chúng tôi kết hợp các kỹ thuật truyền thống với các thiết bị, kỹ thuật hiện đại, cam kết mang đến những sản phẩm thủ công độc đáo bền trong từng thiết kế.",
    },
    {
      iconUrl: "/hihi1.webp", // THAY BẰNG ĐƯỜNG DẪN ẢNH THẬT
      title: "Kết nối thân tình",
      description:
        "Với chúng tôi, board games không chỉ để giải trí. Đó là những trò chơi nâng tầm phong cách sống, lan tỏa niềm vui và thắt chặt mối dây thâm tình. Maztermind hy vọng có thể giúp bạn khơi nguồn cảm hứng cho những kết nối sâu sắc, và chạm đến những tầng xúc cảm xa hơn.",
    },
    {
      iconUrl: "/hihi1.webp", // THAY BẰNG ĐƯỜNG DẪN ẢNH THẬT
      title: "Vẻ đẹp thẩm mỹ",
      description:
        "Hơn cả một trò chơi, mỗi một sản phẩm là một tác phẩm nghệ thuật, hài hòa trong từng đường nét mà bạn có thể dùng để làm đẹp không gian sống. hay trao gửi như một món quà trân tình và ý nghĩa.",
    },
  ];

   // Dữ liệu cho timeline (ví dụ)
   const timelineData = [
    {
      id: 'year1',
      year: '2018 - 2019',
      title: 'Khởi đầu hành trình',
      description: 'Hành trình của chúng tôi bắt đầu vào năm 2018, dưới sự dẫn dắt của anh Nguyễn Ngọc Toàn. Cả đội với niềm đam mê sáng tạo những trò chơi truyền thống, ấp ủ ước mơ thành lập một thương hiệu board games “Made in Vietnam” để tôn vinh những giá trị truyền thống Việt vươn tầm quốc tế. Đội ngũ dành phần lớn thời gian để R&D, phát triển các trò chơi phổ biến ở Việt Nam như Ô ăn quan, Cờ Caro và Cờ cá ngựa. Sau đó, chúng tôi mở rộng các dòng sản phẩm đến các trò chơi cờ điện tử khắp nơi trên thế giới như Cờ vua, Cờ tướng, hay Poker.',
      imageUrl: '/anh1.webp', // Thay bằng ảnh thật từ image_91ab93.jpg
      altText: 'Bàn cờ vua và các sản phẩm Maztermind đầu tiên'
    },
    {
      id: 'year2',
      year: '2020',
      title: 'Ra mắt Bầu Cua phiên bản Việt',
      description: 'Sau khoảng thời gian nghiên cứu phát triển sản phẩm, Maztermind đã chính thức chào sân tung ra thị trường những phiên bản board games Việt đầu tiên. Năm 2020 cũng lại là một năm đáng nhớ, khi chúng tôi chào đón Tết Nguyên Đán bằng bộ Bầu Cua (Hoo Hey How) với một diện mạo hoàn toàn mới từ chất liệu cho đến thiết kế, kèm theo là bộ bài “Immortals - Legend of Vietnam” đầu tiên lấy cảm hứng từ những vị thành viên Việt Nam.',
      imageUrl: '/anh2.webp', // Thay bằng ảnh thật từ image_91a811.png
      altText: 'Bộ Bầu Cua phiên bản Maztermind'
    },
    // Thêm các mốc thời gian khác tại đây:
    {
      id: 'year3',
      year: '2021 - 2022',
      title: 'Mở rộng thị trường',
      description: 'Maztermind tiếp tục phát triển các sản phẩm mới và mở rộng kênh phân phối, đưa các bộ cờ đến tay nhiều người chơi hơn trên toàn quốc và quốc tế.',
      imageUrl: '/anh3.webp', // <--- THAY THẾ BẰNG ẢNH THẬT CỦA BẠN
      altText: 'Mở rộng thị trường'
    },
    {
      id: 'year4',
      year: '2023 - Nay',
      title: 'Đổi mới và phát triển bền vững',
      description: 'Chúng tôi không ngừng đổi mới trong thiết kế và chất liệu, đồng thời cam kết phát triển bền vững, sử dụng vật liệu thân thiện với môi trường và quy trình sản xuất có trách nhiệm.',
      imageUrl: '/anh4.webp', // <--- THAY THẾ BẰNG ẢNH THẬT CỦA BẠN
      altText: 'Đổi mới và phát triển bền vững'
    },
  ];

  return (
    <Layout>
      {/* Tabs Navigator */}
      <AboutTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Conditional Content Rendering */}
      {activeTab === "maztermind" && (
        <>
          <AboutSection
            imageUrl="/about.webp" // Ảnh cho phần "Về Maztermind"
            altText="Người thợ thủ công đang làm việc"
            title="Cách tân mới tạo nên một “Ván cờ nghệ thuật”"
            description="Từ những bàn tay khéo léo của người thợ Việt ngoài ngôi nhà của bạn, mọi bộ cờ của Maztermind đều được thiết kế sáng tạo và tỉ mỉ, kỳ công để biến mọi cuộc chơi thành một “Ván cờ nghệ thuật”. Chúng tôi không chỉ tạo ra một trò chơi đơn thuần, chúng tôi còn tạo nên những khoảnh khắc kết nối cho bạn và những người thân yêu, và hơn hết, là những giá trị nghệ thuật vượt thời gian."
          />
          <AboutSectionRight
            imageUrl="/about2.webp" // Ảnh cho phần "Về Maztermind"
            altText="Người thợ thủ công đang làm việc"
            title="Cách tân mới tạo nên một “Ván cờ nghệ thuật”"
            description="Từ những bàn tay khéo léo của người thợ Việt ngoài ngôi nhà của bạn, mọi bộ cờ của Maztermind đều được thiết kế sáng tạo và tỉ mỉ, kỳ công để biến mọi cuộc chơi thành một “Ván cờ nghệ thuật”. Chúng tôi không chỉ tạo ra một trò chơi đơn thuần, chúng tôi còn tạo nên những khoảnh khắc kết nối cho bạn và những người thân yêu, và hơn hết, là những giá trị nghệ thuật vượt thời gian."
          />
         
         <CoreValuesSection values={coreValuesData} />
         <TimelineSection timelineData={timelineData} />
         <AboutSection
            imageUrl="/about.webp" // Ảnh cho phần "Về Maztermind"
            altText="Người thợ thủ công đang làm việc"
            title="Cách tân mới tạo nên một “Ván cờ nghệ thuật”"
            description="Từ những bàn tay khéo léo của người thợ Việt ngoài ngôi nhà của bạn, mọi bộ cờ của Maztermind đều được thiết kế sáng tạo và tỉ mỉ, kỳ công để biến mọi cuộc chơi thành một “Ván cờ nghệ thuật”. Chúng tôi không chỉ tạo ra một trò chơi đơn thuần, chúng tôi còn tạo nên những khoảnh khắc kết nối cho bạn và những người thân yêu, và hơn hết, là những giá trị nghệ thuật vượt thời gian."
          />
        </>
      )}

      {activeTab === "craftsmanship" && (
        <>
          {/* Đây là nội dung cho tab "Nghệ thuật thủ công" */}
          <CoreValuesSection values={coreValuesData} />
          <TimelineSection timelineData={timelineData} />
          <ShuffleHero />
          {/* Bạn có thể thêm các AboutSection hoặc các component khác dành riêng cho tab "Nghệ thuật thủ công" tại đây */}
        </>
        
      )}
    </Layout>
  );
};

export default AboutPageContent;
