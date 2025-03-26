"use client";

import { useState, useEffect } from "react";
import { fetchChatHistory, storeChat } from "./api";
import AsideIcon from "./AsideIcon";
import { 
  PlusCircleIcon,
  ChatBubbleOvalLeftIcon as ChatBubbleIcon,
  XMarkIcon as CloseIcon
} from '@heroicons/react/24/outline';
import { useTheme } from "next-themes";
import { RiChatNewLine } from "react-icons/ri";

interface AsideProps {
  onSelectConversation: (id: number) => void;
  onNewConversation: () => void; // New prop for handling new conversations
}

export default function Aside({ onSelectConversation, onNewConversation }: AsideProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Fetch conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await fetchChatHistory();
        setConversations(data);
      } catch (error) {
        console.error("Error loading conversations:", error);
      }
    };
    loadConversations();
  }, []);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) =>
    conv.user_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <AsideIcon
          onClick={() => setIsAsideOpen(!isAsideOpen)}
          isAsideOpen={isAsideOpen}
        />
      </div>

      {/* Desktop Sidebar */}
      <aside className={`
        hidden md:block fixed top-0 left-0 h-screen
        ${isAsideOpen ? "w-64" : "w-20"}
        bg-background border-r border-border
        shadow-lg transition-all duration-300 ease-in-out
        z-40
      `}>
        <div className="h-full flex flex-col">
          {/* Theme Switcher (hidden but functional) */}
          <div className="p-2 flex justify-end">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-accent opacity-0 w-0 h-0"
              aria-label="Toggle theme"
            />
          </div>

          {/* Collapse/Expand Button */}
          <div className="p-4 hover:bg-accent w-full flex justify-center md:justify-end">
            <button
              onClick={() => setIsAsideOpen(!isAsideOpen)}
              className="focus:outline-none"
              aria-label={isAsideOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isAsideOpen ? (
                <CloseIcon className="w-6 h-6 text-foreground" />
              ) : (
                <ChatBubbleIcon className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className={`flex-1 ${isAsideOpen ? "block" : "hidden"}`}>
            {/* New Conversation Button - Fixed at bottom */}
            <div className="p-2 border-t border-border">
              <button
                onClick={onNewConversation}
                className={`w-full p-2 rounded-md hover:bg-accent transition-colors
                flex items-center justify-center gap-2
                ${isAsideOpen ? "justify-start" : "justify-center"}`}
                aria-label="New conversation"
              >
                <RiChatNewLine className="w-6 h-6 text-primary" />
                {isAsideOpen && (
                  <span className="text-sm">New</span>
                )}
              </button>
            </div>

            {/* Search */}
            <div className="mb-6 p-2">
              <input
                type="text"
                placeholder="Search Conversations"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-md
                outline-none placeholder-muted-foreground
                focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Conversation List */}
            <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-16rem)] p-2">
              {filteredConversations.map((conv) => (
                <li
                  key={conv.id}
                  className="px-3 py-2 bg-secondary rounded-md cursor-pointer
                  hover:bg-accent transition-colors duration-200 flex items-center"
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <ChatBubbleIcon className="w-5 h-5 flex-shrink-0 mr-2 text-muted-foreground" />
                  {isAsideOpen && (
                    <span className="text-sm text-foreground truncate">
                      {conv.user_message}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay Sidebar */}
      {isAsideOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
            onClick={() => setIsAsideOpen(false)}
          />
          <aside className={`
            md:hidden fixed top-0 left-0 h-screen w-64
            bg-background border-r border-border
            shadow-lg transform transition-transform duration-300 ease-in-out
            ${isAsideOpen ? "translate-x-0" : "-translate-x-full"}
            z-40 p-4
          `}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <button
                onClick={() => setIsAsideOpen(false)}
                className="p-2 rounded-full hover:bg-accent"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile New Conversation Icon */}
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => {
                  onNewConversation();
                  setIsAsideOpen(false);
                }}
                className="p-2 rounded-full hover:bg-accent transition-colors"
                aria-label="New conversation"
              >
                <PlusCircleIcon className="w-8 h-8 text-primary" />
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search Conversations"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-md
                outline-none placeholder-muted-foreground
                focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-16rem)]">
              {filteredConversations.map((conv) => (
                <li
                  key={conv.id}
                  className="px-3 py-2 bg-secondary rounded-md cursor-pointer
                  hover:bg-accent transition-colors duration-200 flex items-center"
                  onClick={() => {
                    onSelectConversation(conv.id);
                    setIsAsideOpen(false);
                  }}
                >
                  <ChatBubbleIcon className="w-5 h-5 flex-shrink-0 mr-2 text-muted-foreground" />
                  <span className="text-sm text-foreground truncate">
                    {conv.user_message}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </>
      )}
    </>
  );
}