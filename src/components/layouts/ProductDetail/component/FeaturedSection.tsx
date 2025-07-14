import React from "react";
import TwoColumnContentBlock from "./TwoColumnContentBlock";

export interface FeatureSection {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  textBgColor?: string;
  isImageRight?: boolean;
}

interface FeaturedSectionProps {
  mainIntro: {
    title: string;
    description: string;
  };
  sections: FeatureSection[];
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  mainIntro,
  sections
}) => (
  <section className="w-full">
    <div className="w-full py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{mainIntro.title}</h2>
        <p className="text-gray-700 text-lg">{mainIntro.description}</p>
      </div>
    </div>
    {sections.map((section, index) => (
      <TwoColumnContentBlock
        key={index}
        title={section.title}
        description={section.description}
        imageSrc={section.imageSrc}
        imageAlt={section.imageAlt}
        textBgColor={section.textBgColor}
        isImageRight={section.isImageRight}
      />
    ))}
  </section>
);

export default FeaturedSection;