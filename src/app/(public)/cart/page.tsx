// app/cart/page.tsx (Ví dụ với App Router)
import Cart from '@/components/layouts/Cart/Cart'; // Đảm bảo đường dẫn alias đúng
const CartPage: React.FC = () => {
  return (
    <main>
      <Cart />
    </main>
  );
};

export default CartPage;