import React from 'react';
import { FilterDropdown } from '@/components/common/FilterDropdown'; 

interface Tag {
  id: string;
  name: string;
  type: string; 
}

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  onTagChange,
}) => {
  return (
   <FilterDropdown title="Tags" initialOpen={false}>
      <div className="space-y-2">
      {tags.map((tag) => (
        <label key={tag.id} className="flex items-center text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            value={String(tag.id)}
            checked={selectedTags.includes(String(tag.id))}
            onChange={onTagChange}
            className="form-checkbox h-4 w-4 text-text-900 rounded focus:ring-text-900"
          />
          <span className="ml-2 text-base">{tag.name}</span>
        </label>
      ))}
      </div>
    </FilterDropdown>
  );
};