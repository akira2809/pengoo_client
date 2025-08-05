// src/components/product/ProductPageHeader.tsx
import React, { Fragment, Dispatch, SetStateAction } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';

interface SortOption {
  id: number;
  name: string;
  value: string;
}

interface ProductPageHeaderProps {
  sortOptions: SortOption[];
  sortSelected: SortOption;
  setSortSelected: Dispatch<SetStateAction<SortOption>>;
  totalFilteredProducts: number;
  totalProducts: number;
}

export const ProductPageHeader: React.FC<ProductPageHeaderProps> = ({
  sortOptions,
  sortSelected,
  setSortSelected,
  totalFilteredProducts,
  totalProducts
}) => {

  const color = totalFilteredProducts === 0 ? 'yellow' : 'green';
  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      {/* Thông báo số lượng sản phẩm */}
      <div className={`w-full lg:w-auto order-last lg:order-first mb-4 lg:mb-0 p-4 bg-${color}-50 border-l-4 border-${color}-400`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {
              totalFilteredProducts === 0 ? <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg> :
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z" clipRule="evenodd" />
                </svg>

            }
          </div>
          <div className="ml-3">
            <p className={`text-sm text-${color}-700`}>
              Đang hiển thị {totalFilteredProducts} sản phẩm (Tổng: {totalProducts})
            </p>
          </div>
        </div>
      </div>

      {/* Dropdown sắp xếp */}
      <Listbox value={sortSelected} onChange={setSortSelected}>
        {({ open }) => (
          <div className="relative w-full sm:w-auto min-w-[200px] lg:ml-auto">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm">
              <span className="block truncate">{sortSelected.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <FaChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {sortOptions.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                      }`
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <FaCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
};