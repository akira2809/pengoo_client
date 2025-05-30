import React from 'react';

export const AboutMaztermindSection = () => {
  return (
    <section className="bg-background-100 py-16 px-4 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Về Pengoo
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Pengoo là thương hiệu thiết kế và chế tác board games thủ công cao cấp. 
          Lựa chọn hướng đi thẩm mỹ, bền vững, thành phẩm cuối cùng tạo ra là một sự pha trộn hài hoà, 
          giữa bộ óc người thiết kế và bàn tay tài tình người nghệ nhân Việt Nam.
        </p>
        <button className="bg-background-400 hover:bg-amber-700 text-text-700 font-semibold py-3 px-8 rounded-md transition-colors duration-300">
          Tìm hiểu thêm
        </button>
      </div>
    </section>
  );
};