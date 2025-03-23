"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import '../style/EmojiPicker.css';

// Dynamically import the emoji picker (to avoid SSR issues)
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

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
    <div className="emojiPickerContainer">
      <button
        className="emojiButton"
        onClick={() => setShowPicker(!showPicker)}
      >
        😊
      </button>
      {showPicker && (
        <div className="picker">
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}