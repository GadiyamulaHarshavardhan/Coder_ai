"use client";
import { useState, useEffect } from 'react';
import Aside from './components/Aside';
import ChatBox from './components/ChatBox';
import InputBox from './components/InputBox';
import { fetchChatHistory, generateResponse, storeChat } from './components/api';

type MessageType = {
  id: string;  // Add unique IDs
  role: 'user' | 'assistant';  // Consistent role types
  content: string;
  isTyping?: boolean;
};

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      const loadMessages = async () => {
        try {
          const history = await fetchChatHistory();
          const conversation = history.find(conv => conv.id === selectedConversationId);
          if (conversation) {
            setMessages([
              {
                id: `user-${Date.now()}`,
                role: 'user',
                content: conversation.user_message
              },
              {
                id: `ai-${Date.now()}`,
                role: 'assistant',
                content: conversation.ai_response
              }
            ]);
          }
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      };
      loadMessages();
    } else {
      setMessages([]);  // Clear when no conversation selected
    }
  }, [selectedConversationId]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    
    // 1. Add user message immediately
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message
    }]);

    try {
      // 2. Add typing indicator
      setMessages(prev => [...prev, {
        id: `typing-${Date.now()}`,
        role: 'assistant',
        content: '',
        isTyping: true
      }]);

      // 3. Get AI response
      const aiResponse = await generateResponse(message);
      
      // 4. Store in database
      await storeChat(message, aiResponse);

      // 5. Replace typing with response
      setMessages(prev => [
        ...prev.filter(msg => !msg.isTyping),
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: aiResponse
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev.filter(msg => !msg.isTyping),
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "Sorry, something went wrong"
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Aside onSelectConversation={setSelectedConversationId} />
      <div className="flex flex-col flex-1 p-6">
        <h1 className="text-3xl font-bold text-white-800 mb-6">Jarvis</h1>
        <ChatBox messages={messages} />
        <InputBox onSendMessage={sendMessage} />
      </div>
    </div>
  );
}