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
          <div className="flex justify-center gap-8 mt-8 w-full max-w-5xl mx-auto">
            {tabs[activeTab].images.length === 1 && (
              <div className="w-full flex justify-center">
                <Image
                  src={tabs[activeTab].images[0]}
                  alt={`Tab ${activeTab + 1} Img 1`}
                  width={1400}
                  height={1000}
                  className="object-cover rounded-xl border shadow w-full max-w-3xl h-auto bg-gray-100"
                  style={{ background: "#f3f4f6" }}
                />
              </div>
            )}
            {tabs[activeTab].images.length === 2 && (
              <div className="flex gap-8 w-full">
                <div className="w-1/2">
                  <Image
                    src={tabs[activeTab].images[0]}
                    alt={`Tab ${activeTab + 1} Img 1`}
                    width={900}
                    height={1000}
                    className="object-cover rounded-xl border shadow w-full h-[500px] bg-gray-100"
                    style={{ background: "#f3f4f6" }}
                  />
                </div>
                <div className="w-1/2">
                  <Image
                    src={tabs[activeTab].images[1]}
                    alt={`Tab ${activeTab + 1} Img 2`}
                    width={900}
                    height={1000}
                    className="object-cover rounded-xl border shadow w-full h-[500px] bg-gray-100"
                    style={{ background: "#f3f4f6" }}
                  />
                </div>
              </div>
            )}
            {tabs[activeTab].images.length >= 3 && (
              <>
                <div className="flex flex-col justify-between w-[40%]">
                  <Image
                    src={tabs[activeTab].images[0]}
                    alt={`Tab ${activeTab + 1} Img 1`}
                    width={1000}
                    height={1800}
                    className="object-cover rounded-xl border shadow w-full h-[700px] bg-gray-100"
                    style={{ background: "#f3f4f6" }}
                  />
                </div>
                <div className="flex flex-col gap-8 w-[60%]">
                  <Image
                    src={tabs[activeTab].images[1]}
                    alt={`Tab ${activeTab + 1} Img 2`}
                    width={1400}
                    height={700}
                    className="object-cover rounded-xl border shadow w-full h-[340px] bg-gray-100"
                    style={{ background: "#f3f4f6" }}
                  />
                  <Image
                    src={tabs[activeTab].images[2]}
                    alt={`Tab ${activeTab + 1} Img 3`}
                    width={1400}
                    height={700}
                    className="object-cover rounded-xl border shadow w-full h-[340px] bg-gray-100"
                    style={{ background: "#f3f4f6" }}
                  />
                </div>
              </>
            )}
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
                  <div className="flex justify-center gap-6 mt-4 w-full max-w-full">
                    {tab.images.length === 1 && (
                      <div className="w-full flex justify-center">
                        <Image
                          src={tab.images[0]}
                          alt={`Tab ${index + 1} Img 1`}
                          width={1200}
                          height={900}
                          className="object-cover rounded-xl border shadow w-full max-w-xl h-auto bg-gray-100"
                          style={{ background: "#f3f4f6" }}
                        />
                      </div>
                    )}
                    {tab.images.length === 2 && (
                      <div className="flex gap-6 w-full">
                        <div className="w-1/2">
                          <Image
                            src={tab.images[0]}
                            alt={`Tab ${index + 1} Img 1`}
                            width={800}
                            height={900}
                            className="object-cover rounded-xl border shadow w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100"
                            style={{ background: "#f3f4f6" }}
                          />
                        </div>
                        <div className="w-1/2">
                          <Image
                            src={tab.images[1]}
                            alt={`Tab ${index + 1} Img 2`}
                            width={800}
                            height={900}
                            className="object-cover rounded-xl border shadow w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100"
                            style={{ background: "#f3f4f6" }}
                          />
                        </div>
                      </div>
                    )}
                    {tab.images.length >= 3 && (
                      <>
                        <div className="flex flex-col justify-between w-[45%]">
                          <Image
                            src={tab.images[0]}
                            alt={`Tab ${index + 1} Img 1`}
                            width={900}
                            height={1600}
                            className="object-cover rounded-xl border shadow w-full h-[600px] bg-gray-100"
                            style={{ background: "#f3f4f6" }}
                          />
                        </div>
                        <div className="flex flex-col gap-6 w-[55%]">
                          <Image
                            src={tab.images[1]}
                            alt={`Tab ${index + 1} Img 2`}
                            width={1200}
                            height={600}
                            className="object-cover rounded-xl border shadow w-full h-[290px] bg-gray-100"
                            style={{ background: "#f3f4f6" }}
                          />
                          <Image
                            src={tab.images[2]}
                            alt={`Tab ${index + 1} Img 3`}
                            width={1200}
                            height={600}
                            className="object-cover rounded-xl border shadow w-full h-[290px] bg-gray-100"
                            style={{ background: "#f3f4f6" }}
                          />
                        </div>
                      </>
                    )}
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
