# Pengoo Client Sitemap

## App Directory Structure
```
src/
├── app/
│   ├── (auth)/                         # Authentication routes
│   │   ├── account/                   # User account management
│   │   ├── forgot-password/           # Password recovery
│   │   ├── mfa-verification/          # Multi-factor authentication
│   │   ├── reset-password/            # Password reset
│   │   ├── signin/                    # Sign in
│   │   ├── signup/                    # Sign up
│   │   └── components/                # Auth components
│   │
│   ├── (public)/                      # Public routes
│   │   ├── about/                     # About us
│   │   ├── blogs/                     # Blog posts
│   │   ├── cart/                      # Shopping cart
│   │   ├── checkout/                  # Checkout process
│   │   ├── collection/                # Product collections
│   │   ├── commitment/                # Company commitments
│   │   ├── contact/                   # Contact information
│   │   ├── order/                     # Order management
│   │   ├── partner/                   # Partnership information
│   │   ├── products/                  # Product listings
│   │   ├── promotionPolicy/           # Promotion policies
│   │   ├── returnPolicy/              # Return policies
│   │   ├── shippingPolicy/            # Shipping information
│   │   └── termsOfServicePolicy/      # Terms of service
│   │
│   ├── api/                           # API routes
│   │   ├── auth/                      # Authentication API
│   │   ├── chat/                      # Chat functionality
│   │   ├── data/                      # General data API
│   │   ├── minigame/                  # Mini-game API
│   │   ├── orders/                    # Order management API
│   │   └── products/                  # Product API
│   │
│   ├── stores/                        # State management
│   │   └── slice/                     # Redux slices
│   │
│   ├── hooks/                         # Custom hooks
│   ├── type/                          # TypeScript type definitions
│   └── utils/                         # Utility functions
│
├── components/
│   ├── account/                      # Account related components
│   │
│   ├── common/                       # Shared components
│   │   ├── UI/                      # Basic UI components
│   │   └── scratch-minigame/        # Mini-game components
│   │
│   ├── features/                     # Feature components
│   │   └── Product/                 # Product related components
│   │
│   └── layouts/                      # Page layouts
│       ├── About/                   # About page layout
│       ├── Auth/                    # Authentication layout
│       ├── Blog/                    # Blog layout
│       ├── Cart/                    # Shopping cart layout
│       ├── Checkout/                # Checkout layout
│       ├── Contact/                 # Contact page layout
│       ├── Footer/                  # Footer component
│       ├── Header/                  # Header component
│       ├── HomePage/                # Homepage layout
│       ├── Login&Signup/            # Login/Signup forms
│       ├── Policy/                  # Policy pages layout
│       ├── Popup/                   # Popup components
│       ├── ProductDetail/           # Product detail layout
│       └── collection/              # Collection page layout
│
└── public/                           # Static files

## Key Features
- **User Authentication**: Complete auth flow with MFA support
- **E-commerce**: Product browsing, cart, and checkout
- **Blog System**: Content management for articles
- **Policies**: Comprehensive policy pages
- **Mini-games**: Interactive elements for engagement
- **Responsive Design**: Mobile-first approach

## API Structure
- RESTful endpoints for data operations
- Authentication and authorization
- Real-time chat functionality
- Product and order management