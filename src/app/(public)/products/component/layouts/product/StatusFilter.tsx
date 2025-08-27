// src/components/product/filters/StatusFilter.tsx
import React from 'react';
import { FilterDropdown } from '@/components/common/FilterDropdown';

interface StatusFilterProps {
  selectedStatus: string[];
  onStatusChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Định nghĩa các status có sẵn
const statusOptions = [
  { 
    id: 'available', 
    name: 'Có sẵn', 
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300'
  },
  { 
    id: 'coming soon', 
    name: 'Sắp ra mắt', 
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300'
  },
  { 
    id: 'unavailable', 
    name: 'Không khả dụng', 
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300'
  },
  { 
    id: 'discontinued', 
    name: 'Ngừng sản xuất', 
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300'
  }
];

export const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <FilterDropdown title="Trạng thái sản phẩm" initialOpen={false}>
      <div className="space-y-3">
        {statusOptions.map((status) => (
          <label
            key={status.id}
            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
              selectedStatus.includes(status.id)
                ? `${status.bgColor} ${status.borderColor} shadow-sm`
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              value={status.id}
              checked={selectedStatus.includes(status.id)}
              onChange={onStatusChange}
              className="w-4 h-4 text-background-900 bg-gray-100 border-gray-300 rounded focus:ring-background-500 focus:ring-2"
            />
            <div className="ml-3 flex items-center">
              <span className={`text-sm font-medium ${
                selectedStatus.includes(status.id) ? status.color : 'text-gray-700'
              }`}>
                {status.name}
              </span>
            </div>
          </label>
        ))}
        
        {/* Hiển thị số lượng đã chọn */}
        {selectedStatus.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Đã chọn {selectedStatus.length} trạng thái
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedStatus.map((statusId) => {
                const status = statusOptions.find(s => s.id === statusId);
                return status ? (
                  <span
                    key={statusId}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}
                  >
                    {status.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </FilterDropdown>
  );
};