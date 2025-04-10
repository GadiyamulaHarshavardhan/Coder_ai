"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeSnippetProps {
  code: string; // The code to display
  language?: string; // Programming language for syntax highlighting (e.g., "javascript", "python")
  readOnly?: boolean; // Whether the editor is read-only
}

export default function CodeSnippet({ code, language = "javascript", readOnly = true }: CodeSnippetProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Copy code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset "Copied" message after 2 seconds
    });
  };

  return (
    <div className="relative mt-2">
      {/* Editor */}
      <Editor
        height="200px" // Adjust height as needed
        language={language}
        value={code}
        theme="vs-dark" // Dark theme for better readability
        options={{
          readOnly, // Make the editor read-only
          minimap: { enabled: false }, // Disable minimap
          lineNumbers: "on", // Show line numbers
          scrollBeyondLastLine: false, // Disable extra scrolling
          fontSize: 14, // Adjust font size
          wordWrap: "on", // Enable word wrap for better readability
        }}
      />

      {/* Copy Button */}
      <button
        className="absolute top-2 right-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 active:scale-95 transition-all"
        onClick={handleCopy}
      >
        {isCopied ? "Copied!" : "Copy Code"}
      </button>
    </div>
  );
}