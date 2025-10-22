import type { Message } from '../types/chatbot';
import { API_ENDPOINTS } from '../utils/api';
import type { ChatRequest, ChatResponse, ConversationResponse } from '../utils/api';
import { getAuthToken } from '../utils/auth';

export class ChatBotService {
  private token: string | null = null;

  
  setToken(token: string | null) {
    this.token = token;
  }

  private getToken(): string | null {
    if (this.token) return this.token;
    
    // Use auth utility to get valid token
    return getAuthToken();
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  
  async sendMessage(payload: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.ASSISTANT.CHAT, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        throw new Error('Unauthorized - Please log in');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data: ChatResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }


  async fetchConversationHistory(page: number = 1, pageSize: number = 20): Promise<ConversationResponse> {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.ASSISTANT.CONVERSATION}?page=${page}&pageSize=${pageSize}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (response.status === 401) {
        throw new Error('Unauthorized - Please log in');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch conversation history');
      }

      const data: ConversationResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  }


  convertAPIMessagesToChat(apiMessages: ConversationResponse['data']): Message[] {
    const messages: Message[] = [];

    // Sort messages by creation date (oldest first)
    const sortedMessages = [...apiMessages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    sortedMessages.forEach((entry) => {
      // Add user message
      if (entry.query?.trim()) {
        messages.push({
          id: `user-${entry.id}`,
          text: entry.query,
          sender: 'user',
          timestamp: new Date(entry.createdAt),
        });
      }

      // Add bot response
      if (entry.response?.trim()) {
        messages.push({
          id: `bot-${entry.id}`,
          text: entry.response,
          sender: 'bot',
          timestamp: new Date(entry.createdAt),
        });
      }
    });

    return messages;
  }
}

// Export a singleton instance
export const chatBotService = new ChatBotService();

export default chatBotService;

