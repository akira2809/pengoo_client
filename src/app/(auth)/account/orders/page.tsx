// src/app/(auth)/account/orders/page.tsx
export default function OrdersPage() {
    // Dữ liệu đơn hàng tạm
    const orders = [
      {
        id: 'DH001',
        date: '15/06/2025',
        status: 'Đã giao hàng',
        total: 1_250_000,
        items: [
          { name: 'Sản phẩm A', price: 1_250_000, quantity: 1, image: '/placeholder-product.jpg' }
        ]
      },
      {
        id: 'DH002',
        date: '10/06/2025',
        status: 'Đang giao hàng',
        total: 2_500_000,
        items: [
          { name: 'Sản phẩm B', price: 1_500_000, quantity: 1, image: '/placeholder-product.jpg' },
          { name: 'Sản phẩm C', price: 1_000_000, quantity: 1, image: '/placeholder-product.jpg' }
        ]
      }
    ];
  
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">Mã đơn hàng: {order.id}</h3>
                    <p className="text-sm text-gray-500">Ngày đặt: {order.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'Đã giao hàng' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        <p className="text-sm">{item.price.toLocaleString()}đ</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div className="font-medium">Tổng tiền: {order.total.toLocaleString()}đ</div>
                  <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }