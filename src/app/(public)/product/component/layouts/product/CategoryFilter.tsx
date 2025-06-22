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
    <FilterDropdown title="Sản phẩm" initialOpen={true}>
      <div className="space-y-2">
        {categories.map(category => (
          <label key={category.id} className="flex items-center text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              value={category.id} 
              checked={selectedCategories.includes(category.id)}
              onChange={onCategoryChange}
              className="form-checkbox h-4 w-4 text-amber-800 rounded focus:ring-amber-500"
            />
            <span className="ml-2 text-base">{category.name}</span>
          </label>
        ))}
      </div>
    </FilterDropdown>
  );
};