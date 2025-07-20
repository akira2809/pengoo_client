// ProductReviewsSection.tsx
import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { apiClient } from '@/app/api/apiClient';

interface Review {
  id: number;
  user: { username: string } | string;
  rating: number;
  content: string;
  createdAt: string;
  status?: 'Visible' | 'Hidden';
}

interface ProductReviewsSectionProps {
  productId: number | string;
}

const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/reviews/product/${productId}`);
        const allReviews = Array.isArray(res.data) ? res.data : [];
        const visibleReviews = allReviews
          .filter((r) => r.status === 'Visible')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReviews(visibleReviews);
      } catch {
        setError('Không thể tải đánh giá. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userRating || !userComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await apiClient.post(`/reviews/${productId}`, {
        rating: userRating,
        content: userComment,
      });
      const newReview = res.data;
      if (newReview.status === 'Visible') {
        setReviews((prev) => [newReview, ...prev]);
      }
      setUserRating(0);
      setUserComment('');
    } catch {
      alert('Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const displayedReviews = reviews.slice(0, visibleCount);

  return (
    <section className="max-w-6xl mx-auto my-12 px-4">
      <h3 className="text-xl font-bold mb-6">Đánh giá của người dùng</h3>

      {averageRating && (
        <div className="flex items-center mb-6">
          <span className="text-yellow-500 flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <FaStar key={i} className={i <= Math.round(Number(averageRating)) ? 'text-yellow-400' : 'text-gray-300'} />
            ))}
          </span>
          <span className="ml-2 text-lg font-semibold">{averageRating}/5</span>
          <span className="ml-2 text-gray-500 text-sm">({reviews.length} đánh giá)</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Form bên trái */}
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg shadow">
          <div className="mb-2">
            <span className="block mb-1 text-sm font-medium">Đánh giá của bạn:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <button type="button" key={i} onClick={() => setUserRating(i)} className="focus:outline-none">
                  <FaStar className={i <= userRating ? 'text-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="w-full border rounded p-2 mb-2 mt-2"
            rows={3}
            placeholder="Viết nhận xét của bạn..."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-background-900 text-white px-4 py-2 rounded hover:bg-background-800 transition-colors"
            disabled={submitting || !userRating || !userComment.trim()}
          >
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>

        {/* Danh sách đánh giá bên phải */}
        <div>
          {loading ? (
            <div>Đang tải đánh giá...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : displayedReviews.length === 0 ? (
            <div>Chưa có đánh giá nào.</div>
          ) : (
            <>
              <ul className="space-y-4">
                {displayedReviews.map((review) => (
                  <li key={review.id} className="bg-white p-4 rounded shadow">
                    <div className="flex items-center mb-1">
                      <span className="text-yellow-500 flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <FaStar key={i} className={i <= review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                        ))}
                      </span>
                      <span className="ml-2 font-semibold">
                        {typeof review.user === 'string'
                          ? review.user
                          : review.user?.username || 'Ẩn danh'}
                      </span>
                      <span className="ml-2 text-gray-400 text-xs">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-gray-700">{review.content}</div>
                  </li>
                ))}
              </ul>

              {(visibleCount < reviews.length || visibleCount > 4) && (
                <div className="mt-6 space-x-2">
                  {visibleCount < reviews.length && (
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 4)}
                      className="px-4 py-2 bg-background-900 text-white rounded hover:bg-background-800"
                    >
                      Xem thêm
                    </button>
                  )}
                  {visibleCount > 4 && (
                    <button
                      onClick={() => setVisibleCount(4)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                      Thu gọn
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductReviewsSection;
