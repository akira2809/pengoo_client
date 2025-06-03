"use client";

import React from "react";

type LayoutProps = {
  children: React.ReactNode;
  container?: "85" | "100"; // chọn giữa 85% hoặc full width
  withHeader?: boolean;
  withFooter?: boolean;
};

const Layout = ({
  children,
  container = "85",
}: LayoutProps) => {
  const containerClass =
    container === "85" ? "w-[85%] mx-auto" : "w-full";

  return (
    <div className="min-h-screen bg-background-50 text-gray-900 flex flex-col">
   
      <main className={`flex-1 py-8 ${containerClass}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
