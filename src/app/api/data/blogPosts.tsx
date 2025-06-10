import Image from 'next/image'; // Cần import Image nếu bạn dùng nó trong content

// Định nghĩa kiểu dữ liệu cho một bài viết blog
export interface BlogPost {
  id: string; // Sử dụng làm slug cho URL
  imageSrc?: string; // Ảnh thumbnail/hero của bài viết
  title: string;
  excerpt: string; // Đoạn trích dẫn ngắn
  date: string;
  link: string; // Đường dẫn đến bài viết chi tiết (thường là /blog/[id])
  isFeatured?: boolean; // Đánh dấu bài viết nổi bật trên trang danh sách
  content: (string | JSX.Element)[]; // Nội dung chi tiết của bài viết, có thể là chuỗi hoặc các phần tử JSX
}

// Dữ liệu mẫu cho TẤT CẢ các bài viết blog
export const ALL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'memento-mori-tu-goc-nhin-nghe-si',
    title: "Memento Mori - Từ Góc Nhìn Của Một Nghệ Sĩ",
    excerpt: "Thời gian qua, Maztermind vừa ra mắt bộ bài Memento Mori với thiết kế vô cùng ấn tượng. Khác với các sản phẩm bài Tây đã từng được ra mắt như The historic playing cards và Immortalitas - The agen...",
    date: "24 Thg 1, 2022",
    link: "/blogs/memento-mori-tu-goc-nhin-nghe-si",
    content: [
      `Đây là nội dung chi tiết của bài viết "Memento Mori". Bạn có thể thêm nhiều đoạn văn bản, hình ảnh, danh sách, v.v. vào đây.`,
      `Maztermind vừa ra mắt bộ bài Memento Mori với thiết kế vô cùng ấn tượng. Khác với các sản phẩm bài Tây đã từng được ra mắt như The historic playing cards và Immortalitas - The agent of the apocalypse, Memento Mori mang nét hiện đại nhưng vẫn giữ được những giá trị cốt lõi của thương hiệu.`,
      `Bộ bài này được thiết kế dựa trên triết lý "Memento Mori" - một lời nhắc nhở về sự hữu hạn của cuộc sống, khuyến khích chúng ta sống trọn vẹn từng khoảnh khắc.`,
      <p key="p-memento-1" className="mb-4">
        Các chi tiết thiết kế:
      </p>,
      <ul key="ul-memento-1" className="list-disc pl-5 mb-4 space-y-2">
        <li>Màu sắc chủ đạo: Đen và vàng đồng</li>
        <li>Biểu tượng: Đầu lâu, đồng hồ cát</li>
        <li>Chất liệu: Giấy cao cấp, bền bỉ</li>
      </ul>,
      `Sản phẩm này không chỉ là một bộ bài để chơi mà còn là một tác phẩm nghệ thuật, một vật phẩm sưu tầm ý nghĩa.`
    ]
  },
  {
    id: '4-meo-tang-qua-khong-phai-ai-cung-biet',
    title: "4 Mẹo Tặng Quà Không Phải Ai Cũng Biết",
    excerpt: "Quà tặng là cách mà chúng ta vẫn thường gửi gắm những sự yêu thương, quan tâm dành cho người khác. Trải qua thời gian dài, cho - tặng đã trở thành nét đẹp văn hóa phổ biến và rất quan trọng đối vớ...",
    date: "18 Thg 1, 2022",
    link: "/blog/4-meo-tang-qua-khong-phai-ai-cung-biet",
    content: [
      `Việc tặng quà là một nghệ thuật. Không chỉ là giá trị món quà, mà còn là cách bạn tặng quà thể hiện sự tinh tế và chân thành.`,
      `Dưới đây là 4 mẹo nhỏ mà bạn có thể áp dụng để món quà của mình trở nên ý nghĩa hơn:`,
      <h3 key="h3-meo-1" className="text-xl font-semibold mt-6 mb-3">1. Hiểu người nhận</h3>,
      `Hãy tìm hiểu sở thích, nhu cầu, và tính cách của người mà bạn muốn tặng quà. Một món quà phù hợp sẽ được đánh giá cao hơn nhiều.`,
      <h3 key="h3-meo-2" className="text-xl font-semibold mt-6 mb-3">2. Chú ý đến cách gói quà</h3>,
      `Bao bì đẹp mắt và tinh tế có thể làm tăng giá trị cảm xúc của món quà. Đừng quên một tấm thiệp viết tay chân thành.`,
      <h3 key="h3-meo-3" className="text-xl font-semibold mt-6 mb-3">3. Đúng thời điểm</h3>,
      `Tặng quà vào những dịp đặc biệt như sinh nhật, lễ kỷ niệm, hoặc thậm chí là không có lý do cụ thể, chỉ để thể hiện sự quan tâm.`,
      <h3 key="h3-meo-4" className="text-xl font-semibold mt-6 mb-3">4. Không quá phô trương</h3>,
      `Quan trọng nhất là sự chân thành. Đôi khi, một món quà nhỏ nhưng chứa đựng nhiều tâm huyết sẽ ý nghĩa hơn một món quà đắt tiền nhưng hời hợt.`
    ]
  },
  {
    id: 'uu-dai-tet-nham-dan-2022',
    title: "Ưu Đãi Tết Nhâm Dần 2022",
    excerpt: "Nhân dịp chào đón Tết 2022, Maztermind hi vọng với những ưu đãi hấp dẫn sau: Tặng 1 bộ Bầu cua cho mỗi đơn hàng trên 6.000.000đ (số lượng có hạn) giảm giá đến 30% cho bộ sản phẩm Bầu Cua Xiêm P...",
    date: "10 Thg 1, 2022",
    link: "/blog/uu-dai-tet-nham-dan-2022",
    content: [
      `Chào đón Tết Nhâm Dần 2022, Maztermind mang đến những ưu đãi đặc biệt để tri ân khách hàng thân yêu.`,
      `Các ưu đãi bao gồm:`,
      <ul key="ul-uu-dai-1" className="list-disc pl-5 mb-4 space-y-2">
        <li>Tặng 1 bộ Bầu cua cho mỗi đơn hàng trên 6.000.000đ (số lượng có hạn).</li>
        <li>Giảm giá đến 30% cho bộ sản phẩm Bầu Cua Xiêm Phiên Bản Đặc Biệt.</li>
        <li>Miễn phí vận chuyển cho tất cả các đơn hàng.</li>
      </ul>,
      `Hãy nhanh tay sở hữu những sản phẩm chất lượng cao của Maztermind và tận hưởng mùa Tết ấm áp bên gia đình.`
    ]
  },
  {
    id: 'christmas-promotion',
    title: "Christmas Promotion",
    excerpt: "Maztermind tặng bạn món quà Giáng Sinh với những ưu đãi đặc biệt như sau: Giảm giá đến 15% toàn bộ các sản phẩm Miễn phí giao hàng và gửi quà cho mọi đơn hàng Tặng Combo ví da passport và tag hành...",
    date: "9 Thg 12, 2021",
    link: "/blog/christmas-promotion",
    content: [
      `Giáng Sinh này, Maztermind mang đến cho bạn những món quà ý nghĩa và ưu đãi hấp dẫn.`,
      `Các ưu đãi Giáng Sinh:`,
      <ul key="ul-xmas-1" className="list-disc pl-5 mb-4 space-y-2">
        <li>Giảm giá đến 15% toàn bộ các sản phẩm.</li>
        <li>Miễn phí giao hàng và gửi quà cho mọi đơn hàng.</li>
        <li>Tặng Combo ví da passport và tag hành lý cho các đơn hàng trên 3.000.000đ.</li>
      </ul>,
      `Chúc bạn có một mùa Giáng Sinh an lành và hạnh phúc bên gia đình và người thân!`
    ]
  },
  {
    id: 'board-games-for-two', 
    imageSrc: '/anh1.webp', 
    title: "Gợi Ý 5 Trò Chơi Board Games Hay Nhất Cho Hai Người Chơi",
    excerpt: "Có bao giờ bạn cảm thấy thắc mắc về nguồn gốc của từ “boardgame”? Từ này được ghép từ chữ “board” (bàn hoặc bảng) và “game” (trò chơi), mang hàm ý chỉ những trò chơi thường được chơi ở trên bàn ho...",
    date: "16 Thg 11, 2021",
    link: "/blogs/board-games-for-two",
    isFeatured: true,
    content: [
      `Có bao giờ bạn cảm thấy thắc mắc về nguồn gốc của từ “boardgame”? Từ này được ghép từ chữ “board” (bàn hoặc bảng) và “game” (trò chơi), mang hàm ý chỉ những trò chơi thường được chơi ở trên bàn hoặc bảng. Từ xưa đến nay, boardgame vẫn luôn giữ vị trí độc tôn trong thể loại game trí tuệ bởi luật chơi hấp dẫn và tính ganh đua cao.`,
      `Để không bị áp lực về vấn đề không gian hay quá bận tâm về địa điểm, boardgame 2 người chơi là một sự lựa chọn tối ưu. Những bộ board game cho 2 người chơi hay nhất bạn nên thử qua một lần trong đời là:`,
      <h2 key="h2-1" className="text-2xl font-bold mt-8 mb-4">1. Boardgame cho người thích hồi hộp</h2>,
      <p key="p-1" className="mb-4">
        Các yếu tố thú vị:
      </p>,
      <ul key="ul-1" className="list-disc pl-5 mb-4 space-y-2">
        <li>Trò chơi cướp cờ</li>
        <li>Thời gian chơi khoảng 10 phút</li>
        <li>12 ván</li>
      </ul>,
      <p key="p-2" className="mb-4">
        *Boardgame Chickens – The Heist
      </p>,
      <h2 key="h2-2" className="text-2xl font-bold mt-8 mb-4">2. Bầu cua tôm cá</h2>,
      <p key="p-3" className="mb-4">
        Là một trò chơi truyền thống của Việt Nam thường được chơi vào các dịp lễ, Tết Nguyên Đán.
      </p>,
      <div key="img-content-1" className="relative w-full h-[300px] mb-8">
        <Image
          src="/image_5307c7.jpg" 
          alt="Backgammon and Chess"
          layout="fill"
          objectFit="cover"
          quality={80}
        />
      </div>,
      <p key="p-4" className="mb-4">
        Cách chơi:
      </p>,
      <ul key="ul-2" className="list-disc pl-5 mb-4 space-y-2">
        <li>Người chơi đặt cược vào các con vật (bầu, cua, tôm, cá, gà, nai).</li>
        <li>Nhà cái lắc 3 con xúc xắc, nếu mặt xúc xắc trùng với mặt cược của người chơi, người chơi thắng.</li>
      </ul>,
      <p key="p-5" className="mb-4">
        Trò chơi này đơn giản, mang tính giải trí cao, phù hợp cho mọi lứa tuổi và không yêu cầu nhiều kỹ năng.
      </p>,
      <h2 key="h2-3" className="text-2xl font-bold mt-8 mb-4">3. Cờ tỷ phú (Monopoly)</h2>,
      <p key="p-6" className="mb-4">
        Một trò chơi kinh điển về mua bán, xây dựng tài sản.
      </p>,
      <ul key="ul-3" className="list-disc pl-5 mb-4 space-y-2">
        <li>Số người chơi: 2-8 người</li>
        <li>Thời gian chơi: 60-180 phút</li>
      </ul>,
      <h2 key="h2-4" className="text-2xl font-bold mt-8 mb-4">4. Cờ vua</h2>,
      <p key="p-7" className="mb-4">
        Trò chơi trí tuệ yêu cầu chiến lược và tư duy logic.
      </p>,
      <ul key="ul-4" className="list-disc pl-5 mb-4 space-y-2">
        <li>Số người chơi: 2 người</li>
        <li>Thời gian chơi: Tùy thuộc vào người chơi</li>
      </ul>,
      <h2 key="h2-5" className="text-2xl font-bold mt-8 mb-4">5. Domino</h2>,
      <p key="p-8" className="mb-4">
        Trò chơi xếp gạch quen thuộc, đơn giản và dễ chơi.
      </p>,
      <ul key="ul-5" className="list-disc pl-5 mb-4 space-y-2">
        <li>Số người chơi: 2-4 người</li>
        <li>Thời gian chơi: 15-30 phút</li>
      </ul>,
      `Hy vọng với những gợi ý này, bạn sẽ tìm được những trò board game phù hợp để cùng bạn bè và người thân có những giây phút giải trí vui vẻ.`
    ],
  },
  {
    id: 'co-ca-ngua-thanh-troy-nghe-thuat-thu-cong',
    title: "Cờ Cá Ngựa Thành Troy - Bậc Thang Nghệ Thuật In Đậm Dấu Ấn Thủ Công",
    excerpt: "Khác với bản truyền thống thông thường, bộ cờ cá ngựa thành Troy của Maztermind là một tác phẩm đúc kết của quá trình tìm kiếm sự mới mẻ, khát khao làm ra vật phẩm mang đậm tính nghệ thuật. Để t...",
    date: "27 Thg 9, 2021",
    link: "/blog/co-ca-ngua-thanh-troy-nghe-thuat-thu-cong",
    content: [
      `Bộ cờ cá ngựa Thành Troy của Maztermind không chỉ là một trò chơi giải trí, mà còn là một tác phẩm nghệ thuật thủ công tinh xảo.`,
      `Điểm nổi bật:`,
      <ul key="ul-ngua-1" className="list-disc pl-5 mb-4 space-y-2">
        <li>Thiết kế độc đáo, lấy cảm hứng từ sử thi Thành Troy.</li>
        <li>Chất liệu gỗ tự nhiên cao cấp, được chạm khắc tỉ mỉ.</li>
        <li>Mỗi chi tiết đều thể hiện sự khéo léo và tâm huyết của người nghệ nhân.</li>
      </ul>,
      `Sản phẩm này là sự kết hợp hoàn hảo giữa trò chơi truyền thống và nghệ thuật thủ công hiện đại.`
    ]
  },
  // Thêm các bài viết khác nếu bạn muốn để điền vào trang
  {
    id: 'huong-dan-cach-choi-bau-cua',
    imageSrc: '/blog-image-2.jpg', // Đảm bảo ảnh này nằm trong thư mục `public` của bạn
    title: "HƯỚNG DẪN CÁCH CHƠI BẦU CUA TRĂM TRẬN TRĂM THẮNG",
    excerpt: "Trò chơi bầu cua tôm cá là một trong trò chơi truyền thống giải trí phổ biến ở Việt Nam vào các dịp lễ, đặc biệt là Tết Nguyên Đán với cách chơi đơn giản giúp gắn kết thêm rộn ràng hơn...",
    date: "15 Thg 1, 2024",
    link: "/blog/huong-dan-cach-choi-bau-cua",
    content: [
        `Bầu cua tôm cá là trò chơi dân gian phổ biến tại Việt Nam, đặc biệt vào dịp Tết Nguyên Đán. Luật chơi đơn giản nhưng vẫn có những mẹo nhỏ giúp bạn tăng tỷ lệ thắng.`,
        <h3 key="h3-bc-1" className="text-xl font-semibold mt-6 mb-3">1. Hiểu luật chơi</h3>,
        `Trò chơi sử dụng 3 viên xúc xắc có 6 mặt (bầu, cua, tôm, cá, gà, nai) và một bảng đặt cược. Người chơi đặt cược vào các con vật, nhà cái lắc xúc xắc.`,
        <h3 key="h3-bc-2" className="text-xl font-semibold mt-6 mb-3">2. Mẹo chọn cửa</h3>,
        `Theo dõi kết quả các ván trước để đưa ra phán đoán. Một số người tin vào việc đặt cược vào các con vật xuất hiện nhiều lần hoặc các cặp con vật hay đi cùng nhau.`,
        <h3 key="h3-bc-3" className="text-xl font-semibold mt-6 mb-3">3. Quản lý vốn</h3>,
        `Đặt ra giới hạn cho bản thân và không theo đuổi những ván thua. Chơi giải trí là chính.`
    ]
  },
  {
    id: 'kham-pha-niem-vui-tet-voi-bo-bau-cua-y-giao',
    imageSrc: '/blog-image-3.jpg', // Đảm bảo ảnh này nằm trong thư mục `public` của bạn
    title: "KHÁM PHÁ NIỀM VUI TẾT VỚI BỘ BẦU CUA Ý GIAO",
    excerpt: "Ngày Tết là dịp để gia đình, bạn bè và người thân sum họp, chia sẻ niềm vui và ước nguyện cho năm mới. Ngoài những hoạt động truyền thống như cúng thừa, bản pháo hoa, xông nhà, lì xì... thì vị...",
    date: "12 Thg 1, 2024",
    link: "/blog/kham-pha-niem-vui-tet-voi-bo-bau-cua-y-giao",
    content: [
        `Bộ Bầu Cua Ý Giao của Maztermind mang đến một làn gió mới cho trò chơi truyền thống này vào dịp Tết Nguyên Đán.`,
        `Điểm đặc biệt:`,
        <ul key="ul-bc-yg-1" className="list-disc pl-5 mb-4 space-y-2">
            <li>Thiết kế sang trọng, tinh tế.</li>
            <li>Chất liệu cao cấp, bền đẹp.</li>
            <li>Phù hợp làm quà tặng ý nghĩa.</li>
        </ul>,
        `Hãy cùng khám phá niềm vui và gắn kết gia đình với bộ Bầu Cua Ý Giao trong mùa Tết này!`
    ]
  },
  {
    id: 'sample-post-7',
    title: "Tiêu đề bài viết số 7: Khám phá thế giới thủ công",
    excerpt: "Đi sâu vào nghệ thuật thủ công truyền thống và hiện đại, tìm hiểu về những giá trị và ý nghĩa mà nó mang lại trong cuộc sống ngày nay...",
    date: "01 Thg 1, 2021",
    link: "/blog/sample-post-7",
    content: [
        `Thủ công không chỉ là việc tạo ra sản phẩm bằng tay mà còn là nghệ thuật, là sự kết tinh của tài năng và đam mê.`,
        `Trong thế giới hiện đại, giá trị của đồ thủ công ngày càng được nâng cao bởi sự độc đáo và tinh xảo của chúng.`
    ]
  },
  {
    id: 'sample-post-8',
    title: "Tiêu đề bài viết số 8: Lợi ích của Board Game",
    excerpt: "Board game không chỉ là trò giải trí mà còn mang lại nhiều lợi ích bất ngờ cho người chơi ở mọi lứa tuổi, từ tư duy đến giao tiếp xã hội...",
    date: "05 Thg 10, 2020",
    link: "/blog/sample-post-8",
    content: [
        `Chơi board game giúp rèn luyện tư duy, kỹ năng giải quyết vấn đề, và khả năng lập chiến lược.`,
        `Nó cũng là một cách tuyệt vời để kết nối với bạn bè và gia đình, tăng cường giao tiếp và sự gắn kết.`
    ]
  },
];

// Hàm tìm bài viết theo ID/Slug
export const getBlogPostById = (id: string): BlogPost | undefined => {
  return ALL_BLOG_POSTS.find(post => post.id === id);
};