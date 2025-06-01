// components/QuantitySelector.tsx
import React, { useState, useEffect } from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(quantity.toString());

  // Update internal state when prop changes
  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleDecrement = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1;
      onQuantityChange(newQuantity);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      onQuantityChange(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input (will be handled on blur)
    if (value === '') {
      setInputValue('');
      return;
    }
    
    // Only allow numbers
    if (/^\d+$/.test(value)) {
      const numValue = parseInt(value, 10);
      
      // If number is within range, update both input and quantity
      if (numValue >= min && numValue <= max) {
        setInputValue(value);
        onQuantityChange(numValue);
      } else if (numValue > max) {
        // If number is above max, set to max
        setInputValue(max.toString());
        onQuantityChange(max);
      } else {
        // If number is below min, just update the input (will be handled on blur)
        setInputValue(value);
      }
    }
  };

  const handleBlur = () => {
    // If input is empty or invalid, reset to min
    if (inputValue === '' || parseInt(inputValue, 10) < min) {
      setInputValue(min.toString());
      onQuantityChange(min);
    } else if (parseInt(inputValue, 10) > max) {
      // If input is above max, set to max
      setInputValue(max.toString());
      onQuantityChange(max);
    }
  };

  return (
    <div className={`flex items-center border border-gray-300 rounded-md overflow-hidden w-36 bg-white ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4B3C2D] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Giảm số lượng"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        min={min}
        max={max}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="w-12 text-center border-0 focus:ring-0 p-0 text-sm font-medium text-gray-900 bg-transparent outline-none"
        aria-label="Số lượng"
      />
      
      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4B3C2D] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Tăng số lượng"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default QuantitySelector;