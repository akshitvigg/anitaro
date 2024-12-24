import { MangaNavbar } from "@/components/mangaNavbar";
import React from "react";

export default function MangaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <MangaNavbar />
      {children}
    </div>
  );
}
