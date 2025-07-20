"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

interface HeaderWrapperProps {
  noHeaderPaths: string[];
}

export default function HeaderWrapper({ noHeaderPaths }: HeaderWrapperProps) {
  const pathname = usePathname();

  // Check if current path should hide header
  const shouldHideHeader = noHeaderPaths.some((path) =>
    pathname?.startsWith(path)
  );

  if (shouldHideHeader) {
    return null;
  }

  return <Header />;
}
