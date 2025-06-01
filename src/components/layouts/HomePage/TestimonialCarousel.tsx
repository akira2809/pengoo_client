import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Icon sao
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'; // Icon mũi tên

// Dữ liệu cho các lời chứng thực
const TESTIMONIALS_DATA = [
  {
    id: 1,
    rating: 5, // Số sao
    quote: "Dạo một vòng những sản phẩm của Pengoo`, chúng ta có thể tìm thấy những bộ trò chơi từ 'tây' với tuổi đời lên đến cả trăm năm như cờ vua, cờ tướng, cờ caro,...",
    authorInitial: "A", // Chữ cái đầu của tác giả
    authorName: "Advertising Vietnam",
  },
  {
    id: 2,
    rating: 4,
    quote: "Sản phẩm thủ công rất tinh xảo, chất lượng vượt trội. Tôi rất hài lòng với các sản phẩm của Pengoo`.",
    authorInitial: "B",
    authorName: "Khách hàng B",
  },
  {
    id: 3,
    rating: 5,
    quote: "Thiết kế độc đáo và ý nghĩa. Mỗi bộ board game không chỉ là trò chơi mà còn là một tác phẩm nghệ thuật.",
    authorInitial: "C",
    authorName: "Đối tác C",
  },
];

export const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? TESTIMONIALS_DATA.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === TESTIMONIALS_DATA.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = TESTIMONIALS_DATA[currentIndex];

  return (
    <section className="bg-background-50 py-16 px-4 md:py-24"> {/* Nền màu be nhạt giống ảnh */}
      <div className="max-w-4xl mx-auto text-center relative">
        {/* Rating Stars */}
        <div className="flex justify-center mb-8">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-2xl mx-1 ${
                i < currentTestimonial.rating ? "text-yellow-500" : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Quote */}
        <p className="text-xl md:text-2xl font-serif text-gray-800 leading-relaxed italic mb-10 max-w-2xl mx-auto">
          &ldquo;{currentTestimonial.quote}&rdquo;
        </p>

        {/* Author Info */}
        <div className="flex flex-col items-center mb-10">
          {/* Author Initial Circle */}
          <div className="bg-black text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">
            {currentTestimonial.authorInitial}
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {currentTestimonial.authorName}
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={goToPrevious}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            <IoIosArrowBack className="text-gray-700 text-xl" />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex gap-2">
            {TESTIMONIALS_DATA.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? "bg-gray-700" : "bg-gray-300"
                } transition-colors duration-200`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>

          <button
            onClick={goToNext}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
            aria-label="Next testimonial"
          >
            <IoIosArrowForward className="text-gray-700 text-xl" />
          </button>
        </div>
      </div>
    </section>
  );
};