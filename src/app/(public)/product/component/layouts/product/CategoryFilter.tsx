// src/components/product/filters/CategoryFilter.tsx
import React from 'react';
import { FilterDropdown } from '@/components/common/FilterDropdown'; // Đảm bảo đường dẫn đúng

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryChange, 
}) => {
  return (
    <FilterDropdown title="Sản phẩm" initialOpen={false}>
      <div className="space-y-2">
        {categories.map(category => (
          <label key={category.id} className="flex items-center text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              value={String(category.id)} 
              checked={selectedCategories.includes(String(category.id))}
              onChange={onCategoryChange}
              className="form-checkbox h-4 w-4 text-text-900 rounded focus:ring-text-900"
            />
            <span className="ml-2 text-base">{category.name}</span>
          </label>
        ))}
      </div>
    </FilterDropdown>
  );
};