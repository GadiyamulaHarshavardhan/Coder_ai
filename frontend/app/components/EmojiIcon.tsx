"use client";

import { useState } from "react";

interface EmojiIconProps {
  onClick: () => void;
}

export default function EmojiIcon({ onClick }: EmojiIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className="bg-transparent border-none cursor-pointer p-2 flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-110 hover:opacity-90"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Open emoji picker"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`w-6 h-6 transition-all duration-200 ease-in-out ${
          isHovered ? "fill-gray-500 rotate-12" : "fill-gray-400"
        }`}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-6.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S6.17 12 7 12s1.5.67 1.5 1.5zm7 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM12 15c-1.66 0-3 1.34-3 3h6c0-1.66-1.34-3-3-3z" />
      </svg>
    </button>
  );
}