// src/components/product/filters/PriceRangeFilter.tsx
import React, { Dispatch, SetStateAction } from 'react';
import { Switch } from '@headlessui/react';
import { FilterDropdown } from '@/components/common/FilterDropdown'; // Đảm bảo đường dẫn đúng

interface PriceRange {
  min: number;
  max: number;
}

interface DisplayRange {
  min: string;
  max: string;
}

interface PriceRangeFilterProps {
  priceRange: PriceRange;
  displayRange: DisplayRange;
  showOutOfStock: boolean;
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => void;
  handleFocus: (e: React.FocusEvent<HTMLInputElement>, type: 'min' | 'max') => void;
  handleBlur: (type: 'min' | 'max') => void;
  setShowOutOfStock: Dispatch<SetStateAction<boolean>>;
  formatPrice: (price: number | string) => string;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceRange,
  displayRange,
  showOutOfStock,
  handlePriceChange,
  handleFocus,
  handleBlur,
  setShowOutOfStock,
  formatPrice,
}) => {
  return (
    <FilterDropdown title="Giá" initialOpen={false}>
      <div className="text-gray-700 text-base">
        <p>Khoảng giá: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}</p>
        <div className="flex justify-between items-center mt-2 text-sm">
          <input
            type="number"
            placeholder="Từ"
            min="0"
            value={displayRange.min || priceRange.min}
            onChange={(e) => handlePriceChange(e, 'min')}
            onFocus={(e) => handleFocus(e, 'min')}
            onBlur={() => handleBlur('min')}
            className="w-5/12 p-2 border border-gray-300 rounded-md focus:ring-background-900 focus:border-background-900"
          />
          <span className="mx-1">-</span>
          <input
            type="number"
            placeholder="Đến"
            min={priceRange.min}
            value={displayRange.max || priceRange.max}
            onChange={(e) => handlePriceChange(e, 'max')}
            onFocus={(e) => handleFocus(e, 'max')}
            onBlur={() => handleBlur('max')}
            className="w-5/12 p-2 border border-gray-300 rounded-md focus:ring-background-900 focus:border-background-900"
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm">Hiển thị hết hàng</span>
          <Switch
            checked={showOutOfStock}
            onChange={(checked) => setShowOutOfStock(checked)}
            className={`${
              showOutOfStock ? 'bg-background-800' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-background-900 focus:ring-offset-2`}
          >
            <span
              className={`${
                showOutOfStock ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div>
    </FilterDropdown>
  );
};