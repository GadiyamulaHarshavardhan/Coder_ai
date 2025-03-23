"use client";
import React, { useRef, useState, useEffect } from 'react';
import Message from './Message';
import '../style/ChatBox.css';

interface ChatBoxProps {
  messages: { role: string; content: string }[];
  chatBoxRef?: React.RefObject<HTMLDivElement>;
}

export default function ChatBox({ messages, chatBoxRef }: ChatBoxProps) {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate AI typing
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'ai') {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, 2000); // Simulate typing for 2 seconds
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div
      ref={chatBoxRef}
      className="chatBox"
    >
      {messages.map((msg, index) => (
        <Message
          key={index}
          role={msg.role}
          content={msg.content}
          isTyping={isTyping && index === messages.length - 1} // Show typing for the last AI message
        />
      ))}
      <div ref={messagesEndRef} /> {/* Invisible div for auto-scrolling */}
    </div>
  );
}