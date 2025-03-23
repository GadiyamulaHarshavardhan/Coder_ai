"use client";

import React from 'react';
import CodeSnippet from './CodeSnippet'; // Import the CodeSnippet component
import '../style/Message.css';

interface MessageProps {
  role: string;
  content: string;
  isTyping?: boolean;
}

export default function Message({ role, content, isTyping }: MessageProps) {
  // Check if the content contains a code snippet (e.g., wrapped in ```)
  const isCodeSnippet = content.startsWith('```') && content.endsWith('```');

  // Extract the code and language if it's a code snippet
  const code = isCodeSnippet ? content.slice(3, -3).trim() : '';
  const language = isCodeSnippet ? code.split('\n')[0].trim() || 'javascript' : '';

  return (
    <div className={`message ${role === 'user' ? 'userMessage' : 'aiMessage'}`}>
      {isCodeSnippet ? (
        <CodeSnippet code={code.replace(language, '').trim()} language={language} />
      ) : (
        <p>{content}</p>
      )}
      {isTyping && <span className="typingIndicator">Typing...</span>}
    </div>
  );
}