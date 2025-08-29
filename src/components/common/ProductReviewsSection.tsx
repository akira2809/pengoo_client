// ProductReviewsSection.tsx
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { apiClient } from "@/app/api/apiClient";
import { orderService } from "@/app/api/services/orderService";
import { useAuthStore } from "@/app/stores/slice/useAuthStore";

interface Review {
  id: number;
  user: { username: string } | string;
  rating: number;
  content: string;
  createdAt: string;
  status?: "Visible" | "Hidden";
}

// Import the same types used in OrdersContent
interface OrderWithUser {
  id: number | string;
  user?: {
    id: number | string;
  };
  details?: Array<{
    productId: number;
    product?: {
      id: number;
      product_name: string;
      images?: Array<{
        id: number;
        url: string;
        name: string;
        folder: string | null;
        ord: number | null;
      }>;
    };
    quantity: number;
    price: string;
  }>;
  order_date?: string;
  total_price: number;
  productStatus?:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  [key: string]: unknown;
}

interface ProductReviewsSectionProps {
  productId: number | string;
}

const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);
  const reviewsPerPage = 5;

  const { user, isAuthenticated } = useAuthStore();

  // Kiểm tra xem người dùng có thể đánh giá sản phẩm không
  const checkCanReview = React.useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setCanReview(false);
      setCheckingPurchase(false);
      return;
    }

    try {
      // Use the same approach as OrdersContent
      const response = await orderService.getAllOrders();
      if (response?.data) {
        const allOrders = response.data as unknown as OrderWithUser[];
        // Filter orders for current user
        const userOrders = allOrders.filter(
          (order) => order.user?.id === user.id
        );

        console.log("User orders:", userOrders);
        console.log("Current productId:", productId, "Type:", typeof productId);

        // Kiểm tra xem người dùng có đơn hàng nào chứa sản phẩm này với trạng thái "delivered"
        const hasDeliveredProduct = userOrders.some((order: OrderWithUser) => {
          console.log(
            "Checking order:",
            order.id,
            "Status:",
            order.productStatus
          );

          if (order.productStatus === "delivered") {
            const hasProduct = order.details?.some((detail) => {
              console.log(
                "Checking product:",
                detail.product?.id,
                "vs",
                Number(productId)
              );
              return detail.product?.id === Number(productId);
            });
            console.log("Order has product:", hasProduct);
            return hasProduct;
          }
          return false;
        });

        console.log("Can review:", hasDeliveredProduct);
        setCanReview(hasDeliveredProduct);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra quyền đánh giá:", error);
      setCanReview(false);
    } finally {
      setCheckingPurchase(false);
    }
  }, [isAuthenticated, user?.id, productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/reviews/product/${productId}`);
        const allReviews = Array.isArray(res.data) ? res.data : [];
        const visibleReviews = allReviews
          .filter((r) => r.status === "Visible")
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        
        // Check if current user has already reviewed
        if (user?.id) {
          const userReview = visibleReviews.find(review => 
            typeof review.user !== 'string' && review.user?.id === user.id
          );
          setHasReviewed(!!userReview);
        }
        
        setReviews(visibleReviews);
        setTotalPages(Math.ceil(visibleReviews.length / reviewsPerPage));
      } catch {
        setError("Không thể tải đánh giá. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
    checkCanReview();
  }, [productId, checkCanReview, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userRating || !userComment.trim() || hasReviewed) return;
    setSubmitting(true);
    try {
      const res = await apiClient.post(`/reviews/${productId}`, {
        rating: userRating,
        content: userComment,
      });
      const newReview = res.data as Review;
      if (newReview.status === "Visible") {
        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        setHasReviewed(true);
        setTotalPages(Math.ceil(updatedReviews.length / reviewsPerPage));
      }
      setUserRating(0);
      setUserComment("");
    } catch {
      alert("Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  const displayedReviews = reviews.slice(
    (page - 1) * reviewsPerPage,
    page * reviewsPerPage
  );

  return (
    <section className="max-w-4xl mx-auto my-12 px-4">
      <h3 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h3>

      {averageRating && (
        <div className="flex items-center mb-8">
          <span className="text-yellow-500 flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <FaStar
                key={i}
                className={
                  i <= Math.round(Number(averageRating))
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
                size={24}
              />
            ))}
          </span>
          <span className="ml-3 text-xl font-semibold">{averageRating}/5</span>
          <span className="ml-2 text-gray-600">
            ({reviews.length} đánh giá)
          </span>
        </div>
      )}

      <div className="space-y-8">
        {/* Form đánh giá */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {checkingPurchase ? (
            <div className="text-center py-4">
              <div>Đang kiểm tra quyền đánh giá...</div>
            </div>
          ) : !isAuthenticated ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-2">
                Bạn cần đăng nhập để có thể đánh giá sản phẩm
              </p>
              <button
                onClick={() => (window.location.href = "/signin")}
                className="bg-background-900 text-white px-4 py-2 rounded hover:bg-background-800 transition-colors"
              >
                Đăng nhập
              </button>
            </div>
          ) : !canReview ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-2">
                Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng
                thành công
              </p>
              <p className="text-sm text-gray-500">
                Vui lòng kiểm tra lại đơn hàng của bạn.
              </p>
            </div>
          ) : (
            <div className="p-4">
              <h4 className="text-lg font-medium mb-4">Viết đánh giá của bạn</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="mr-2">Đánh giá của bạn:</span>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setUserRating(i)}
                        className="focus:outline-none"
                      >
                        <FaStar
                          className={`w-6 h-6 ${
                            i <= userRating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !userRating || !userComment.trim() || hasReviewed}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </form>
              {hasReviewed && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  Bạn đã đánh giá sản phẩm này. Cảm ơn bạn đã đóng góp ý kiến!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Danh sách đánh giá */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p className="font-medium">Đã xảy ra lỗi</p>
              <p>{error}</p>
            </div>
          ) : displayedReviews.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
              <p className="text-sm text-gray-400 mt-2">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {displayedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {typeof review.user === 'object' ? review.user.username : 'Ẩn danh'}
                        </h4>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-500 mr-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <FaStar
                                key={i}
                                className={`w-4 h-4 ${i <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">{review.content}</p>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Trước
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-full ${
                          page === pageNum 
                            ? 'bg-blue-500 text-white' 
                            : 'border hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductReviewsSection;
