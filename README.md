# Pengoo Client

Nền tảng thương mại điện tử hiện đại được xây dựng bằng các công nghệ web tiên tiến.

## 🚀 Công nghệ chính

- **Next.js 15** - Framework React cho ứng dụng render phía máy chủ
- **React 19** - Thư viện JavaScript để xây dựng giao diện người dùng
- **TypeScript** - Kiểm tra kiểu tĩnh cho JavaScript
- **Tailwind CSS** - Framework CSS ưu tiên tiện ích
- **Zustand** - Giải pháp quản lý state

## 🎨 Giao diện & Giao diện người dùng

- **Material-UI (MUI) v7** - Thư viện component React
- **Emotion** - Giải pháp CSS-in-JS
- **Headless UI** - Các component UI không style, hỗ trợ truy cập
- **Lucide React** - Bộ icon đẹp và đồng nhất
- **clsx & tailwind-merge** - Các hàm tiện ích cho class name có điều kiện

## 🎬 Hoạt ảnh & Tương tác

- **GSAP** - Thư viện hoạt ảnh chuyên nghiệp
- **Framer Motion** - Thư viện chuyển động cho React
- **Lenis** - Thư viện cuộn mượt mà
- **@gsap/react** - Hooks chính thức của GSAP cho React

## 🛠 Công cụ phát triển

- **ESLint** - Công cụ kiểm tra lỗi JavaScript/TypeScript
- **PostCSS** - Xử lý CSS
- **Turbopack** - Công cụ đóng gói dựa trên Rust (mặc định của Next.js)

## 📦 Quản lý gói

- **npm** - Trình quản lý gói Node.js

## 🎯 Tính năng chính

- Render phía máy chủ (SSR)
- Tạo trang tĩnh (SSG)
- Thiết kế đáp ứng
- Hoạt ảnh và chuyển tiếp mượt mà
- Mã nguồn an toàn kiểu
- Quản lý state hiện đại
- Tối ưu hiệu năng

## 🚀 Bắt đầu

1. Sao chép kho lưu trữ
2. Cài đặt các phụ thuộc:
   ```bash
   npm install
   ```
3. Chạy máy chủ phát triển:
   ```bash
   npm run dev
   ```
4. Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt

## 📝 Biến môi trường

Tạo file `.env` trong thư mục gốc và thêm các biến sau:

```env
NEXT_PUBLIC_API_BASE_URL=đường_dẫn_api_của_bạn
```

## 📂 Cấu trúc dự án

```
src/
├── app/                    # Các trang và bố cục định tuyến
├── components/             # Các thành phần có thể tái sử dụng
├── lib/                    # Các hàm tiện ích
├── public/                 # Tệp tĩnh
└── styles/                 # Kiểu toàn cục
```

## 🤝 Đóng góp

1. Fork kho lưu trữ
2. Tạo nhánh tính năng (`git checkout -b feature/TinhNangMoi`)
3. Commit các thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Đẩy lên nhánh (`git push origin feature/TinhNangMoi`)
5. Mở Pull Request

## 📄 Giấy phép

Dự án này được cấp phép theo giấy phép MIT - xem tệp [LICENSE](LICENSE) để biết chi tiết.
