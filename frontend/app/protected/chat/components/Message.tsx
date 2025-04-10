"use client";

import React, { useState } from "react";
import CodeSnippet from "./CodeSnippet";
import { UserIcon } from "lucide-react";
import { FaGhost } from "react-icons/fa";
import CopyButton from "./CopyButton";

interface MessageProps {
  role: string;
  content: string;
  isTyping?: boolean;
}

export default function Message({ role, content, isTyping }: MessageProps) {
  const [showCopyButton, setShowCopyButton] = useState(false);
  const isCodeSnippet = content.startsWith("```") && content.endsWith("```");
  const code = isCodeSnippet ? content.slice(3, -3).trim() : "";
  const language = isCodeSnippet ? code.split("\n")[0].trim() || "javascript" : "";

  return (
    <div 
      className={`flex w-full ${role === "user" ? "justify-end" : "justify-start"} mb-4`}
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
    >
      <div className={`flex max-w-[80%] ${role === "user" ? "flex-row-reverse" : ""}`}>
        {/* Theme-aware icon */}
        <div className={`flex-shrink-0 ${role === "user" ? "ml-2" : "mr-2"}`}>
          {role === "user" ? (
            <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          ) : (
            <FaGhost className="w-5 h-5 text-gray-400 dark:text-gray-200" />
          )}
        </div>
        
        {/* Message content container */}
        <div className="relative">
          {/* Theme-aware message bubble */}
          <div className={`
            px-4 py-2 rounded-lg relative
            ${role === "user" 
              ? "bg-blue-600 text-white dark:bg-gray-700" 
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"}
          `}>
            {content && (isCodeSnippet ? (
              <CodeSnippet code={code.replace(language, "").trim()} language={language} />
            ) : (
              <p className="whitespace-pre-wrap">{content}</p>
            ))}
            
            {/* Copy button - only shown on hover */}
            {showCopyButton && content && (
              <div className={`absolute ${role === "user" ? "-left-8" : "-right-8"} top-0`}>
                <CopyButton textToCopy={isCodeSnippet ? code : content} />
              </div>
            )}
          </div>
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center mt-1 ml-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Typing</span>
              <div className="flex ml-1 space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}