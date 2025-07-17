import React from "react";
import TwoColumnContentBlock from "./TwoColumnContentBlock";

interface FeaturedSectionProps {
  mainIntro?: {
    title: string;
    description: string;
  };
  sections: {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt?: string;
    textBgColor?: string;
    isImageRight?: boolean;
  }[];
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  mainIntro,
  sections = []
}) => {
  return (
    <section className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 py-8">
      {mainIntro && (
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2">
            {mainIntro.title}
          </h2>
          <p className="text-lg text-gray-600">{mainIntro.description}</p>
        </div>
      )}
      <div className="flex flex-col w-full">
        {sections.map((block, idx) => (
          <TwoColumnContentBlock
            key={idx}
            title={block.title}
            description={block.description}
            imageSrc={block.imageSrc}
            imageAlt={block.imageAlt}
            textBgColor={block.textBgColor}
            // Alternate sides for checkered pattern
            isImageRight={idx % 2 !== 0}
            noRowGap
            fullWidth
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;