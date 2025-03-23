"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import "../style/CodeSnippet.module.css"; // Import the CSS file

interface CodeSnippetProps {
  code: string; // The code to display
  language?: string; // Programming language for syntax highlighting (e.g., "javascript", "python")
  readOnly?: boolean; // Whether the editor is read-only
}

export default function CodeSnippet({ code, language = "python", readOnly = true }: CodeSnippetProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Copy code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset "Copied" message after 2 seconds
    });
  };

  return (
    <div className="codeSnippetContainer">
      {/* Editor */}
      <Editor
        height="auto" // Adjust height dynamically
        language={language}
        value={code}
        theme="vs-dark" // Dark theme for better readability
        options={{
          readOnly, // Make the editor read-only
          minimap: { enabled: false }, // Disable minimap
          lineNumbers: "on", // Show line numbers
          scrollBeyondLastLine: false, // Disable extra scrolling
          fontSize: 16, // Adjust font size
          wordWrap: "on", // Enable word wrap for better readability
          overviewRulerLanes: 0, // Hide the ruler
          glyphMargin: false, // Hide the margin
          folding: false, // Disable folding
        }}
      />

      {/* Copy Button */}
      <button className={`copyButton ${isCopied ? "copied" : ""}`} onClick={handleCopy}>
        <span>{isCopied ? "Copied!" : "Copy Code"}</span>
        <i className="material-icons">content_copy</i>
      </button>
    </div>
  );
}