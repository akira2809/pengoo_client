import React from "react";
import Image from "next/image";

interface Props {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  textBgColor?: string;
  isImageRight?: boolean;
  noRowGap?: boolean;
  fullWidth?: boolean;
}

const TwoColumnContentBlock: React.FC<Props> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  textBgColor = "#fff",
  isImageRight = false,
  noRowGap = false,
  fullWidth = false,
}) => (
  <div
    className={`flex flex-col md:flex-row items-stretch ${
      fullWidth ? "w-full max-w-none" : "w-full"
    } ${noRowGap ? "" : "my-0"}`}
    style={{ minHeight: 0 }}
  >
    {/* Text Box */}
    <div
      className={`
        md:w-1/2 w-full flex items-center justify-center
        ${isImageRight ? "md:order-2" : ""}
        p-0
      `}
    >
      <div
        className="w-full h-full flex flex-col items-center justify-center text-center px-12 py-16 bg-white shadow border border-gray-100"
        style={{
          background: textBgColor,
        }}
      >
        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-blue-700">
          {title}
        </h3>
        <p className="text-gray-700 text-xl leading-relaxed">{description}</p>
      </div>
    </div>
    {/* Image Box */}
    <div
      className={`
        md:w-1/2 w-full flex items-center
        ${isImageRight ? "md:order-1" : ""}
        p-0
      `}
    >
      <div
        className="w-full h-full flex items-center justify-center bg-gray-50 shadow border border-gray-100"
        style={{
          minHeight: 340,
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          width={700}
          height={440}
          className="object-cover w-full h-full"
          style={{ maxHeight: 440, maxWidth: "100%" }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  </div>
);

export default TwoColumnContentBlock;
