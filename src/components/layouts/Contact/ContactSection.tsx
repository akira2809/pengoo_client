'use client';

import React from 'react';
import Image from 'next/image';

interface ContactSectionProps {
  imageUrl: string;
  altText: string;
  title: string;
  description: string;
  imageOnRight?: boolean;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  imageUrl,
  altText,
  title,
  description,
  imageOnRight = false,
}) => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-10">
      <div
        className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${
          imageOnRight ? 'md:flex-row-reverse' : ''
        }`}
      >
        {/* Ảnh */}
        <div className="w-full md:w-1/2 flex-shrink-0">
          <div className="relative w-full h-80 md:h-[600px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt={altText}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Nội dung */}
        <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
          <h2
            className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-6"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {title}
          </h2>

          {description.split('\n').map((line, index) => (
            <p
                key={index}
                className="text-gray-700 text-base md:text-lg leading-relaxed mb-2"
                dangerouslySetInnerHTML={{ __html: line.trim() }}
            />
            ))}

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
