import React from 'react';
import { FilterDropdown } from '@/components/common/FilterDropdown'; // Đảm bảo đường dẫn đúng

interface Tag {
  id: string;
  name: string;
}

interface TagFilterProps {
  tags?: Tag[];
  selectedTags: string[];
  onTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags = [],
  selectedTags,
  onTagChange,
}) => {
  return (
   <FilterDropdown title="Tags" initialOpen={false}>
      <div className="space-y-2">
      {tags.map((tag) => (
        <label key={tag.id} className="flex items-center space-x-1">
          <input
            type="checkbox"
            value={tag.id}
            checked={selectedTags.includes(tag.id)}
            onChange={onTagChange}
            className="accent-primary"
          />
          <span>{tag.name}</span>
        </label>
      ))}
      </div>
    </FilterDropdown>
  );
};