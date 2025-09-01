import React from "react";
import { Tag } from "lucide-react";
import { ImaggaTag } from "../types";

interface TagsDisplayProps {
  tags: ImaggaTag[];
}

export const TagsDisplay: React.FC<TagsDisplayProps> = ({ tags }) => {
  if (tags.length === 0) return null;

  const sortedTags = tags
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 10);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <Tag className="w-5 h-5 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Detected Tags</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {sortedTags.map((tag, index) => {
          let tagValue = tag.tag;
          if (
            typeof tagValue === "object" &&
            tagValue !== null &&
            "en" in tagValue
          ) {
            tagValue = (tagValue as { en: string }).en;
          }
          return (
            <div
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200"
            >
              <span className="font-medium">{tagValue}</span>
              <span className="ml-2 text-xs opacity-75">
                {tag.confidence.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
