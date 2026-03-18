"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronRight, Lock, CheckCircle2, PlayCircle } from "lucide-react";
import { clsx } from "clsx";

interface Video {
  id: string;
  title: string;
  is_completed: boolean;
  locked: boolean;
}

interface SectionItemProps {
  section: {
    id: string;
    title: string;
    videos: Video[];
  };
  initiallyExpanded?: boolean;
}

export const SectionItem = ({ section, initiallyExpanded = false }: SectionItemProps) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const { subjectId, videoId: currentVideoId } = useParams();

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <span className="text-sm font-semibold text-inherit text-left opacity-90">
          {section.title}
        </span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 opacity-40" />
        ) : (
          <ChevronRight className="h-4 w-4 opacity-40" />
        )}
      </button>

      {isExpanded && (
        <div className="bg-black/10">
          {section.videos.map((video) => {
            const isActive = video.id === currentVideoId;
            const canClick = !video.locked;

            const content = (
              <div
                className={clsx(
                  "flex items-center px-4 py-2.5 text-xs transition-colors",
                  isActive 
                    ? "bg-purple-500/10 text-purple-400 border-l-4 border-purple-500 shadow-[inset_4px_0_0_0_#a855f7]" 
                    : "text-inherit opacity-70",
                  canClick ? "hover:bg-white/5 cursor-pointer" : "opacity-30 cursor-not-allowed"
                )}
              >
                <div className="mr-3">
                  {video.locked ? (
                    <Lock className="h-3.5 w-3.5 opacity-40" />
                  ) : video.is_completed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <PlayCircle className={clsx("h-3.5 w-3.5", isActive ? "text-purple-400" : "opacity-40")} />
                  )}
                </div>
                <span className="flex-grow truncate font-medium">{video.title}</span>
              </div>
            );

            if (canClick) {
              return (
                <Link key={video.id} href={`/subjects/${subjectId}/video/${video.id}`} className="no-underline block">
                  {content}
                </Link>
              );
            }

            return <div key={video.id}>{content}</div>;
          })}
        </div>
      )}
    </div>
  );
};
