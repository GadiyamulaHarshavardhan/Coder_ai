"use client";
import React, { useRef, useState, useEffect } from "react";
import Message from "./Message";
import './theme-provider'

interface ChatBoxProps {
  messages: { role: string; content: string }[];
  chatBoxRef?: React.RefObject<HTMLDivElement>;
}

export default function ChatBox({ messages, chatBoxRef }: ChatBoxProps) {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "ai") {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  

  return (
    <div
      ref={chatBoxRef}
      className="fixed inset-0 bg-background flex flex-col"
      style={{ paddingBottom: "125px" }} // Space for input box
    >
      {/* Messages container with constrained height */}
      <div className="flex-1 overflow-y-auto pt-4">
        <div className="w-full max-w-4xl mx-auto px-4 space-y-4">
          {messages.map((msg, index) => (
            <Message
              key={index}
              role={msg.role}
              content={msg.content}
              isTyping={isTyping && index === messages.length - 1}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="fixed bottom-16 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}