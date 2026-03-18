"use client";

import React from "react";

export const VideoProgressBar = ({ percent }: { percent: number }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
      <div 
        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      ></div>
    </div>
  );
};
