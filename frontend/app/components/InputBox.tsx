"use client";
import { useState, useRef, useEffect } from "react";
import EmojiPicker from "./EmojiPicker";
import SendIcon from "./SendIcon";
import { UploadIcon } from "./UploadIcon";
import EmojiIcon from "./EmojiIcon";

interface InputBoxProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => void;
}

export default function InputBox({ onSendMessage, onFileUpload }: InputBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !hasInteracted) {
      containerRef.current.style.bottom = "50%";
      containerRef.current.style.transform = "translate(-50%, 50%)";
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [inputValue]);

  const handleInteraction = () => {
    if (!hasInteracted && containerRef.current) {
      setHasInteracted(true);
      containerRef.current.style.transition = "all 0.5s ease-out";
      containerRef.current.style.bottom = "1rem";
      containerRef.current.style.transform = "translate(-50%, 0)";
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
  };

  const focusTextarea = () => {
    textareaRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
    handleInteraction();
  };

  return (
    <div
      ref={containerRef}
      className="fixed left-1/2 w-[95%] sm:w-[90%] max-w-[700px] flex flex-col gap-2 z-[1000]"
      style={{
        transition: "all 0.5s ease-out",
      }}
    >
      <div className="flex flex-col bg-background rounded-2xl border border-border shadow-lg">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleInteraction();
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
          }}
          onKeyDown={(e) => {
            handleKeyDown(e);
            handleInteraction();
          }}
          onFocus={handleInteraction}
          className="flex-1 p-3 sm:p-4 pb-2 bg-background text-foreground placeholder:text-muted-foreground
                  rounded-t-2xl outline-none resize-none overflow-y-auto
                  max-h-[150px] sm:max-h-[120px] min-h-[44px]
                  border-b border-input focus:border-b-primary focus:ring-0
                  scrollbar-thin scrollbar-thumb-border scrollbar-track-background/50
                  transition-[height] duration-200 ease-in-out text-sm sm:text-base
                  origin-bottom"
          placeholder="Message.."
          rows={1}
        />

        <div className="flex items-center justify-between p-2 sm:px-4 rounded-b-2xl bg-background">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <EmojiIcon
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  focusTextarea();
                  handleInteraction();
                }}
                className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/80 hover:text-foreground transition-colors"
              />
              {showEmojiPicker && (
                <div className="absolute bottom-10 left-0 z-[1000]">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>

            <UploadIcon
              onClick={handleFileButtonClick}
              className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/80 hover:text-foreground transition-colors"
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            />
          </div>

          <SendIcon
            onClick={() => {
              handleSend();
              handleInteraction();
            }}
            disabled={!inputValue.trim()}
            className={`w-5 h-5 sm:w-6 sm:h-6 ${
              !inputValue.trim()
                ? "text-muted-foreground"
                : "text-foreground/80 hover:text-foreground"
            } transition-colors`}
          />
        </div>
      </div>
    </div>
  );
}