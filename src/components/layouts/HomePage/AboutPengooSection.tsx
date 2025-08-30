import Link from 'next/link';
import React from 'react';

export const AboutPengooSection = () => {
  return (
    <section className="py-16 px-4 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-text-950 mb-6">
          Về Pengoo
        </h2>
        <p className="text-lg text-text-800leading-relaxed mb-8">
          Pengoo là thương hiệu cung cấp và kinh doanh boardgame cao cấp.
          Mong muốn lớn nhất của chúng tôi là mang đến những trải nghiệm chơi game tuyệt vời cùng những khoảng khắc khó quên nhất cho khách hàng.
        </p>
        <Link
          href="https://pengoo.store/about">
          <button className="bg-background-800 hover:bg-background-700 text-text-50 font-semibold py-3 px-8 rounded-md transition-colors duration-300">
            Tìm hiểu thêm
          </button>
        </Link>
      </div>
    </section>
  );
};