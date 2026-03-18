"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../common/Button";

interface VideoMetaProps {
  title: string;
  description: string | null;
  subjectTitle: string;
  sectionTitle: string;
  prevVideoId: string | null;
  nextVideoId: string | null;
  subjectId: string;
}

export const VideoMeta = ({
  title,
  description,
  subjectTitle,
  sectionTitle,
  prevVideoId,
  nextVideoId,
  subjectId,
}: VideoMetaProps) => {
  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {subjectTitle} • {sectionTitle}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {prevVideoId ? (
            <Link href={`/subjects/${subjectId}/video/${prevVideoId}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}

          {nextVideoId ? (
            <Link href={`/subjects/${subjectId}/video/${nextVideoId}`}>
              <Button variant="primary" size="sm">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <Button variant="primary" size="sm" disabled>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
      
      {description && (
        <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            About this lesson
          </h3>
          <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
        </div>
      )}
    </div>
  );
};
