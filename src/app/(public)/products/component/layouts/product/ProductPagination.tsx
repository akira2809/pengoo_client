// src/components/product/ProductPagination.tsx
import React from 'react';

interface ProductPaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null; // Don't show pagination if only one page

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-8">
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-l border bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &larr; Trước
        </button>
        {pages
          .filter(i => {
            // Show first page, last page, current page, and pages around current page
            return i === 1 ||
                   i === totalPages ||
                   (i >= currentPage - 1 && i <= currentPage + 1);
          })
          .map((page, idx, array) => {
            // Add ellipsis if there's a gap
            if (idx > 0 && array[idx - 1] !== page - 1) {
              return (
                <React.Fragment key={`ellipsis-bot-${page}`}>
                  <span className="px-2 flex items-center">...</span>
                  <button
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 border-t border-b ${currentPage === page ? 'bg-background-800 text-white' : 'bg-white'}`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            }
            return (
              <button
                key={`bot-${page}`}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 border-t border-b ${currentPage === page ? 'bg-background-800 text-white' : 'bg-white'}`}
              >
                {page}
              </button>
            );
          })}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 rounded-r border bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau &rarr;
        </button>
      </div>
    </div>
  );
};