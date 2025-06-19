'use client';

import React from 'react';
import Image from 'next/image';

interface CommitmentCardProps {
  imageUrl: string;
  altText: string;
  title: string;
  description: string;
  imageOnRight?: boolean;
}

const CommitmentCard: React.FC<CommitmentCardProps> = ({
  imageUrl,
  altText,
  title,
  description,
  imageOnRight = false,
}) => {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className={`flex flex-col md:flex-row items-center gap-8 ${imageOnRight ? 'md:flex-row-reverse' : ''}`}>
        <div className="w-full md:w-1/2">
          <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg shadow-lg">
            <Image
              src={imageUrl}
              alt={altText}
              layout="fill" 
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
          <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CommitmentCard;