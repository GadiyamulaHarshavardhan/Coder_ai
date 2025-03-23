"use client";

import { useState, useEffect } from "react";
import { fetchChatHistory, storeChat } from "./api";
import AsideIcon from "../Icons/AsideIcon"; // Import the AsideIcon component
import "../style/Aside.css"; // Import CSS for styling

interface AsideProps {
  onSelectConversation: (id: number) => void;
}

export default function Aside({ onSelectConversation }: AsideProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newConversationName, setNewConversationName] = useState("");
  const [isAsideOpen, setIsAsideOpen] = useState(false); // State to control aside visibility

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

  // Add a new conversation
  const addConversation = async () => {
    if (newConversationName.trim()) {
      try {
        const newConv = await storeChat(newConversationName.trim(), "");
        setConversations((prev) => [...prev, newConv]);
        setNewConversationName("");
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    }
  };

  return (
    <>
      {/* Aside Icon */}
      <AsideIcon
        onClick={() => setIsAsideOpen(!isAsideOpen)}
        isAsideOpen={isAsideOpen}
      />

      {/* Aside Panel */}
      <aside className={`aside ${isAsideOpen ? "open" : ""}`}>
        {/* Add Conversation Section */}
        <div className="addConversation">
          <input
            type="text"
            placeholder=" New "
            value={newConversationName}
            onChange={(e) => setNewConversationName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addConversation()}
          />
          <button onClick={addConversation}> Add </button>
        </div>

        {/* Search Bar */}
        <div className="searchBar">
          <input
            type="text"
            placeholder=" Search "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Conversation List */}
        <ul className="conversationList">
          {filteredConversations.map((conv) => (
            <li
              key={conv.id}
              className="conversationItem"
              onClick={() => onSelectConversation(conv.id)}
            >
              {conv.user_message}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}