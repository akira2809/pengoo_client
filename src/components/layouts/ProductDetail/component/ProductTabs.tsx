"use client";
import { JSX, useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export type TabSection = {
  title: string;
  content: string | JSX.Element;
  images?: string[];
  references?: { title: string; link: string }[];
};

function getFixedTabs(tabs: TabSection[]): TabSection[] {
  const getTab = (title: string): TabSection =>
    tabs.find(
      (t) => t.title.trim().toLowerCase() === title.toLowerCase()
    ) || (title === "Reference"
      ? { title, content: "", references: [] }
      : { title, content: "", images: [] });
  return [
    getTab("Thông số kĩ thuật"),
    getTab("Cách chơi"),
    getTab("Tài liệu tham khảo"),
  ];
}

export default function ProductTabs({ tabs = [] }: { tabs: TabSection[] }) {
  const fixedTabs = getFixedTabs(tabs);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Reference tab display
  function renderReferenceTab(tab: TabSection) {
    if (!tab.references || tab.references.length === 0) {
      return <span className="text-gray-400 italic">No references provided.</span>;
    }
    return (
      <ul className="list-disc pl-6 space-y-2 text-left">
        {tab.references.map((ref: { title: string; link: string }, idx: number) =>
          ref.title && ref.link ? (
            <li key={idx}>
              <a href={ref.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                {ref.title}
              </a>
            </li>
          ) : null
        )}
      </ul>
    );
  }

  // How To Play tab display (only embed, no raw link)
  function renderHowToPlay(content: string) {
    if (!content) return <span className="text-gray-400 italic">No video link provided.</span>;
    const isYoutube =
      content.includes("youtube.com") || content.includes("youtu.be");
    const isVimeo = content.includes("vimeo.com");
    let embedUrl = content;
    if (isYoutube) {
      if (content.includes("watch?v=")) {
        embedUrl = content.replace("watch?v=", "embed/");
      } else if (content.includes("youtu.be/")) {
        embedUrl = content.replace("youtu.be/", "youtube.com/embed/");
      }
    }
    return (isYoutube || isVimeo) ? (
      <div className="w-full flex justify-center">
        <iframe
          width="560"
          height="315"
          src={embedUrl}
          title="How To Play Video"
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl border shadow w-full max-w-2xl aspect-video"
        />
      </div>
    ) : (
      <span className="text-gray-400 italic">Invalid video link.</span>
    );
  }

  const toggleAccordion = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4">
      {/* Tabs for desktop */}
      <div className="hidden md:flex justify-center border-b ">
        {fixedTabs.map((tab, index) => (
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
        {activeTab === 1 ? (
          renderHowToPlay(fixedTabs[1].content as string)
        ) : activeTab === 2 ? (
          renderReferenceTab(fixedTabs[2])
        ) : (
          <>
            <div className="prose max-w-none mx-auto text-left">
              <ReactMarkdown>
                {(fixedTabs[activeTab].content as string) || "*No details provided.*"}
              </ReactMarkdown>
            </div>
            {fixedTabs[activeTab].images && fixedTabs[activeTab].images.length > 0 && (
              <div className="flex justify-center gap-8 mt-8 w-full max-w-5xl mx-auto">
                {fixedTabs[activeTab].images.length === 1 && (
                  <div className="w-full flex justify-center">
                    <Image
                      src={fixedTabs[activeTab].images[0]}
                      alt={`Tab ${activeTab + 1} Img 1`}
                      width={1400}
                      height={1000}
                      className="object-cover rounded-xl border shadow w-full max-w-3xl h-auto bg-gray-100"
                      style={{ background: "#f3f4f6" }}
                    />
                  </div>
                )}
                {fixedTabs[activeTab].images.length === 2 && (
                  <div className="flex gap-8 w-full">
                    <div className="w-1/2">
                      <Image
                        src={fixedTabs[activeTab].images[0]}
                        alt={`Tab ${activeTab + 1} Img 1`}
                        width={900}
                        height={1000}
                        className="object-cover rounded-xl border shadow w-full h-[500px] bg-gray-100"
                        style={{ background: "#f3f4f6" }}
                      />
                    </div>
                    <div className="w-1/2">
                      <Image
                        src={fixedTabs[activeTab].images[1]}
                        alt={`Tab ${activeTab + 1} Img 2`}
                        width={900}
                        height={1000}
                        className="object-cover rounded-xl border shadow w-full h-[500px] bg-gray-100"
                        style={{ background: "#f3f4f6" }}
                      />
                    </div>
                  </div>
                )}
                {fixedTabs[activeTab].images.length >= 3 && (
                  <>
                    <div className="flex flex-col justify-between w-[40%]">
                      <Image
                        src={fixedTabs[activeTab].images[0]}
                        alt={`Tab ${activeTab + 1} Img 1`}
                        width={1000}
                        height={1800}
                        className="object-cover rounded-xl border shadow w-full h-[700px] bg-gray-100"
                        style={{ background: "#f3f4f6" }}
                      />
                    </div>
                    <div className="flex flex-col gap-8 w-[60%]">
                      <Image
                        src={fixedTabs[activeTab].images[1]}
                        alt={`Tab ${activeTab + 1} Img 2`}
                        width={1400}
                        height={700}
                        className="object-cover rounded-xl border shadow w-full h-[340px] bg-gray-100"
                        style={{ background: "#f3f4f6" }}
                      />
                      <Image
                        src={fixedTabs[activeTab].images[2]}
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
          </>
        )}
      </div>
      {/* Accordion for mobile */}
      <div className="md:hidden space-y-4">
        {fixedTabs.map((tab, index) => (
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
                {index === 1 ? (
                  renderHowToPlay(tab.content as string)
                ) : index === 2 ? (
                  renderReferenceTab(tab)
                ) : (
                  <>
                    <div className="prose max-w-none mx-auto text-left">
                      <ReactMarkdown>
                        {(tab.content as string) || "*No details provided.*"}
                      </ReactMarkdown>
                    </div>
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
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
