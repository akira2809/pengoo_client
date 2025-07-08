'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/collection/${cat.slug}`}
          className="group relative block overflow-hidden aspect-square rounded-xl"
        >
          <div className="relative w-full h-full">
            <Image
              src={cat.image || '/placeholder.png'}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-500" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 drop-shadow">{cat.name}</h2>
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <ArrowRight size={20} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
