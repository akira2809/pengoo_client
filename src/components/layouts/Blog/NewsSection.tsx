// components/NewsSection.tsx
import React from 'react';

// Nếu bạn muốn component này nhận props trong tương lai, bạn có thể định nghĩa interface cho props ở đây
// interface NewsSectionProps {
//   title: string;
// }

const NewsSection: React.FC = () => {
  // const NewsSection: React.FC<NewsSectionProps> = ({ title }) => { // Nếu có props
  return (
    <div className="flex items-center justify-center w-full h-48 bg-gray-200">
      <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">
        News
      </h1>
    </div>
  );
};

export default NewsSection;