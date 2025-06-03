// components/AboutTabs.tsx
"use client"; // Đây là một client component vì nó có tương tác người dùng (onClick)
import React from 'react';

interface AboutTabsProps {
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

const AboutTabs: React.FC<AboutTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-full border-b border-gray-200 sticky top-0 z-10 mt-16 mb-16"> {/* Thêm sticky top và z-index */}
      <div className="container mx-auto flex justify-center text-gray-700 font-semibold text-lg md:text-xl">
        <button
          className={`py-4 px-8 md:px-12 relative transition-colors duration-300 ${
            activeTab === 'maztermind' ? 'text-gray-900' : 'hover:text-gray-900'
          }`}
          onClick={() => onTabChange('maztermind')}
        >
          Về Maztermind
          <span
            className={`absolute bottom-0 left-0 w-full h-1 bg-gray-900 transform transition-transform duration-300 ease-out ${
              activeTab === 'maztermind' ? 'scale-x-100' : 'scale-x-0'
            }`}
          ></span>
        </button>
        <button
          className={`py-4 px-8 md:px-12 relative transition-colors duration-300 ${
            activeTab === 'craftsmanship' ? 'text-gray-900' : 'hover:text-gray-900'
          }`}
          onClick={() => onTabChange('craftsmanship')}
        >
          Nghệ thuật thủ công
          <span
            className={`absolute bottom-0 left-0 w-full h-1 bg-gray-900 transform transition-transform duration-300 ease-out ${
              activeTab === 'craftsmanship' ? 'scale-x-100' : 'scale-x-0'
            }`}
          ></span>
        </button>
      </div>
    </div>
  );
};

export default AboutTabs;