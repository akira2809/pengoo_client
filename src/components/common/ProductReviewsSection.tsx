import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { apiClient } from '@/app/api/apiClient';

interface Review {
  id: number;
  user: { username: string } | string;
  rating: number;
  content: string;
  createdAt: string;
  status?: 'Visible' | 'Hidden'; // Add status field
}

interface ProductReviewsSectionProps {
  productId: number | string;
}

const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/reviews/product/${productId}`);
        // Filter only visible reviews
        const allReviews = Array.isArray(res.data) ? res.data : [];
        setReviews(allReviews.filter((r) => r.status === 'Visible'));
      } catch (err) {
        setError('Không thể tải đánh giá. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  // Submit review
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
      // Only add if visible
      if (newReview.status === 'Visible') {
        setReviews([newReview, ...reviews]);
      }
      setUserRating(0);
      setUserComment('');
    } catch (err) {
      alert('Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="max-w-3xl mx-auto my-12 px-4">
      <h3 className="text-xl font-bold mb-4">Đánh giá của người dùng</h3>
      {averageRating && (
        <div className="flex items-center mb-4">
          <span className="text-yellow-500 flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <FaStar key={i} className={i <= Math.round(Number(averageRating)) ? 'text-yellow-400' : 'text-gray-300'} />
            ))}
          </span>
          <span className="ml-2 text-lg font-semibold">{averageRating}/5</span>
          <span className="ml-2 text-gray-500 text-sm">({reviews.length} đánh giá)</span>
        </div>
      )}

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg shadow">
        <div className="flex items-center mb-2">
          <span className="mr-2 text-sm">Đánh giá của bạn:</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setUserRating(i)}
              className="focus:outline-none"
            >
              <FaStar className={i <= userRating ? 'text-yellow-400' : 'text-gray-300'} />
            </button>
          ))}
        </div>
        <textarea
          className="w-full border rounded p-2 mb-2"
          rows={3}
          placeholder="Viết nhận xét của bạn..."
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          disabled={submitting || !userRating || !userComment.trim()}
        >
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </form>

      {/* Reviews List */}
      {loading ? (
        <div>Đang tải đánh giá...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : reviews.length === 0 ? (
        <div>Chưa có đánh giá nào.</div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
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
      )}
    </section>
  );
};

export default ProductReviewsSection;