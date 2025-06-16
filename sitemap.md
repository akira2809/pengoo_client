src/
├── app/
│   ├── (auth)/                    # Các route yêu cầu xác thực
│   │   ├── account/              # Quản lý tài khoản
│   │   ├── forgot-password/      # Quên mật khẩu
│   │   ├── reset-password/       # Đặt lại mật khẩu
│   │   ├── signin/               # Đăng nhập
│   │   ├── signup/               # Đăng ký
│   │   └── layout.tsx           # Layout cho các trang auth
│   │
│   ├── (public)/                 # Các route công khai
│   │   ├── about/                # Giới thiệu
│   │   ├── blogs/                # Trang blog
│   │   ├── cart/                 # Giỏ hàng
│   │   ├── collection/           # Bộ sưu tập sản phẩm
│   │   └── product/              # Chi tiết sản phẩm
│   │
│   ├── api/                     # API routes
│   ├── stores/                  # Quản lý state (có thể dùng Zustand/Redux)
│   └── ...
│
├── components/
│   ├── common/                  # Các component dùng chung
│   │   ├── BlogSection.tsx      # Section hiển thị blog
│   │   ├── FilterDropdown.tsx   # Dropdown lọc
│   │   ├── MobileFilterModal.tsx # Modal lọc trên mobile
│   │   ├── ProductCard.tsx      # Card sản phẩm
│   │   └── UI/                  # Các component UI cơ bản
│   │
│   └── layouts/                 # Các layout chính
│       ├── About/               # Layout trang about
│       ├── Auth/                # Layout xác thực
│       ├── Blog/                # Layout blog
│       ├── Cart/                # Layout giỏ hàng
│       ├── Footer/              # Footer
│       ├── Header/              # Header
│       ├── HomePage/            # Layout trang chủ
│       └── ProductDetail/       # Layout chi tiết sản phẩm
│
└── lib/
    └── utils.ts                 # Các hàm tiện ích