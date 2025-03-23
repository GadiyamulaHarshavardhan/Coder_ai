const API_BASE_URL = 'http://localhost:8000'; // Replace with your FastAPI backend URL

export const generateResponse = async (prompt: string, model: string = "deepseek-coder-v2") => {
  try {
    const response = await fetch(`http://localhost:8000/generate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, model }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate response: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};


export const storeChat = async (userMessage: string, aiResponse: string) => {
  try {
    const response = await fetch(`http://localhost:8000/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_message: userMessage, ai_response: aiResponse }),
    });

    if (!response.ok) {
      throw new Error(`Failed to store chat: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error storing chat:', error);
    throw error;
  }
};


export const fetchChatHistory = async () => {
  try {
    const response = await fetch(`http://localhost:8000/chat/history/`);

    if (!response.ok) {
      throw new Error(`Failed to fetch chat history: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await fetch(`http://localhost:8000/health`);

    if (!response.ok) {
      throw new Error(`Failed to perform health check: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error performing health check:', error);
    throw error;
  }
};

export const fetchMessages = async (conversationId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/history/`);

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }

    const data = await response.json();
    const conversation = data.find((conv: any) => conv.id === conversationId);
    return conversation ? [conversation.user_message, conversation.ai_response] : [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};
export const sendMessageToConversation = async (
    conversationId: number,
    userMessage: string,
    aiResponse: string
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_message: userMessage, ai_response: aiResponse }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };