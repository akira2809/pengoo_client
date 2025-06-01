// src/components/common/FilterDropdown.tsx
import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io'; // Icon mũi tên xuống

interface FilterDropdownProps {
  title: string;
  children: React.ReactNode; // Nội dung bên trong dropdown (checkboxes, slider, etc.)
  initialOpen?: boolean;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ title, children, initialOpen = true }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <button
        className="flex justify-between items-center w-full text-lg font-semibold text-gray-800 hover:text-gray-900 transition-colors duration-200 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <IoIosArrowDown className={`text-xl transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};