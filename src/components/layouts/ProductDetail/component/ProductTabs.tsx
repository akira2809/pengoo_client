"use client";
import { JSX, useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export type TabSection = {
  title: string;
  content: string | JSX.Element;
  images?: string[];
};

export default function ProductTabs({ tabs = [] }: { tabs: TabSection[] }) {
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
        {tabs[activeTab]?.content}
        {tabs[activeTab]?.images && tabs[activeTab].images.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {tabs[activeTab].images.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`Tab ${activeTab + 1} Img ${i + 1}`}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded border"
              />
            ))}
          </div>
        )}
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
                {tab.images && tab.images.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {tab.images.map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        alt={`Tab ${index + 1} Img ${i + 1}`}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
