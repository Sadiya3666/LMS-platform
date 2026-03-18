"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useSidebarStore } from "../../store/sidebarStore";
import { SectionItem } from "./SectionItem";
import { Spinner } from "../common/Spinner";
import { Alert } from "../common/Alert";

export const SubjectSidebar = () => {
  const { subjectId, videoId } = useParams();
  const { tree, loading, error, fetchTree } = useSidebarStore();

  useEffect(() => {
    if (subjectId) {
      fetchTree(subjectId as string);
    }
  }, [subjectId, fetchTree]);

  if (loading && !tree) return <Spinner className="p-8" />;
  if (error) return <Alert type="error" className="m-4">{error}</Alert>;
  if (!tree) return null;

  return (
    <div className="subject-sidebar">
      <div className="sidebar-header">
        <h2 className="font-bold text-inherit truncate">{tree.title}</h2>
        <p className="text-xs opacity-60 mt-1 uppercase tracking-wider font-semibold">Course Content</p>
      </div>
      <div className="sidebar-content">
        {tree.sections.map((section) => {
          const hasCurrentVideo = section.videos.some(v => v.id === videoId);
          return (
            <SectionItem 
              key={section.id} 
              section={section} 
              initiallyExpanded={hasCurrentVideo}
            />
          );
        })}
      </div>
    </div>
  );
};
