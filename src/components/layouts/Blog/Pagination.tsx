// components/Blog/Pagination.tsx
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Đảm bảo bạn đã cài react-icons

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center items-center space-x-2 mt-16 mb-8" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <FiChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          aria-current={currentPage === number ? 'page' : undefined}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentPage === number
              ? 'bg-gray-800 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          } transition-colors`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <FiChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </nav>
  );
};

export default Pagination;