"use client";

import React from "react";
import { SubjectSidebar } from "../../../components/Sidebar/SubjectSidebar";

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="subject-layout-wrapper">
      <SubjectSidebar />
      <div className="flex-1 overflow-y-auto w-full">
        {children}
      </div>
    </div>
  );
}
