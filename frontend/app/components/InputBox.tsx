"use client";
import { useState, useRef } from "react";
import EmojiPicker from "./EmojiPicker";
import SendIcon from "../Icons/SendIcon";
import UploadIcon from "../Icons/UploadIcon";
import EmojiIcon from "../Icons/EmojiIcon";
import MessageInput from "./MessageInput"; // Import the new MessageInput component
import "../style/InputBox.css";

interface InputBoxProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => void;
}

export default function InputBox({ onSendMessage, onFileUpload }: InputBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to control emoji picker visibility
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="inputContainer">
      {/* Emoji Icon */}
      <div className="emojiContainer">
        <EmojiIcon onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
        {showEmojiPicker && (
          <div className="emojiPickerWrapper">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* File Upload Button */}
      <UploadIcon onClick={handleFileButtonClick} />
      <input
        type="file"
        ref={fileInputRef}
        className="fileInput"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
      />

      {/* Message Input */}
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        placeholder="meassage..."
      />

      {/* Send Button */}
      <SendIcon onClick={handleSend} />
    </div>
  );
}