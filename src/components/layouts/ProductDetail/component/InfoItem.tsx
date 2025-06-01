// components/InfoItem.tsx
import React from 'react';

// Định nghĩa kiểu cho props của component
interface InfoItemProps {
  icon: React.ReactNode; // Icon hiển thị (ví dụ: SVG)
  text: string | React.ReactNode; // Nội dung văn bản
  className?: string; // Optional className for styling
}

const InfoItem: React.FC<InfoItemProps> = ({ 
  icon, 
  text,
  className = '' 
}) => {
  return (
    <div className={`flex items-start ${className}`.trim()}>
      <div className="flex-shrink-0 mt-0.5 mr-3">
        {icon}
      </div>
      {typeof text === 'string' ? (
        <span className="text-sm text-gray-700 leading-normal">{text}</span>
      ) : (
        <div className="text-sm text-gray-700 leading-normal">{text}</div>
      )}
    </div>
  );
};

export default InfoItem;