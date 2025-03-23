"use client";

import React, { useRef, useEffect } from "react";
import "../style/MessageInput.css"; // Import CSS for styling

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
}

export default function MessageInput({
  value,
  onChange,
  onSend,
  placeholder = "Type a message...",
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  // Handle key down events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line on Enter
      onSend(); // Send message
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className="messageInput"
      placeholder={placeholder}
      rows={1}
    />
  );
}