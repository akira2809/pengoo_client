"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

const tabs = [
  {
    title: "Thông Tin Sản Phẩm",
    content: (
      <div>
        <p>- 100 lá bài</p>
        <p>- 1 hộp bài</p>
      </div>
    ),
  },
  {
    title: "Hướng Dẫn Sử Dụng",
    content: (
      <div>
        <p>- Mở bài, chia đều cho người chơi</p>
        <p>- Làm theo hướng dẫn in kèm sản phẩm</p>
      </div>
    ),
  },
  {
    title: "Chính Sách",
    content: (
      <div>
        <p>- Đổi trả trong 7 ngày nếu sản phẩm lỗi do NSX</p>
        <p>- Hỗ trợ bảo hành chất lượng in ấn</p>
      </div>
    ),
  },
];

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4">
      {/* Tabs for desktop */}
      <div className="hidden md:flex justify-center border-b ">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={clsx(
              "px-6 py-3 font-semibold text-gray-600 border-b-2 transition",
              {
                "text-black border-black": activeTab === index,
                "hover:text-black hover:border-black/30 border-transparent":
                  activeTab !== index,
              }
            )}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Desktop content */}
      <div className="hidden md:block mt-8 text-gray-800 text-sm sm:text-base text-center">
        {tabs[activeTab].content}
      </div>

      {/* Accordion for mobile */}
      <div className="md:hidden space-y-4">
        {tabs.map((tab, index) => (
          <div key={index} className="border-t">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center py-4 font-semibold text-left"
            >
              {tab.title}
              <ChevronDown
                className={clsx(
                  "transition-transform duration-300",
                  expandedIndex === index && "rotate-180"
                )}
              />
            </button>
            {expandedIndex === index && (
              <div className="pb-4 text-gray-700 text-sm">
                {tab.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
