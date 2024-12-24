import { NavbarContainer } from "@/components/navbar";
import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <NavbarContainer />
      {children}
    </div>
  );
}
