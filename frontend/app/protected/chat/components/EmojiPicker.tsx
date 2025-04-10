"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the emoji picker (to avoid SSR issues)
const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
}

export default function EmojiPicker({ onEmojiClick }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiObject: any) => {
    onEmojiClick(emojiObject.emoji);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      {/* Emoji Button */}
      <button
        className="bg-transparent border-none text-2xl cursor-pointer text-white"
        onClick={() => setShowPicker(!showPicker)}
      >
        😊
      </button>

      {/* Emoji Picker */}
      {showPicker && (
        <div className="absolute bottom-10 left-0 z-1000">
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}