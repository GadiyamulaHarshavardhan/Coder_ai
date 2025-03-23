"use client";
import { useState, useEffect } from 'react';
import Aside from './components/Aside';
import ChatBox from './components/ChatBox';
import InputBox from './components/InputBox';
import { fetchChatHistory, generateResponse, storeChat } from './components/api';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      const loadMessages = async () => {
        try {
          const history = await fetchChatHistory();
          const conversation = history.find((conv: any) => conv.id === selectedConversationId);
          if (conversation) {
            setMessages([
              { role: 'user', content: conversation.user_message },
              { role: 'ai', content: conversation.ai_response },
            ]);
          }
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      };
      loadMessages();
    }
  }, [selectedConversationId]);

  // Send a message
  const sendMessage = async (message: string) => {
    if (message.trim()) {
      try {
        // Generate a response from the AI
        const aiResponse = await generateResponse(message);

        // Store the chat in the database
        await storeChat(message, aiResponse);

        // Update the UI with the new message and response
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'user', content: message },
          { role: 'ai', content: aiResponse },
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="container">
      <Aside onSelectConversation={setSelectedConversationId} />
      <div className="main">
        <h1 className="header">Jarvis</h1>
        <ChatBox messages={messages} />
        <InputBox onSendMessage={sendMessage} />
      </div>
    </div>
  );
}