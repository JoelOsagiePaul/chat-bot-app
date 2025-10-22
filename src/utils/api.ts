// Get the API base URL from environment variables or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/';
// Ensure the URL ends with a slash
// const API_BASE_URL = baseUrl.endsWith('/') ? `${baseUrl}api/` : `${baseUrl}/api/`;

console.log('🔍 ChatBot API Configuration:');
// console.log('Base URL:', baseUrl);
console.log('API_BASE_URL:', API_BASE_URL);

export { API_BASE_URL };

export const API_ENDPOINTS = {
  ASSISTANT: {
    CONVERSATION: `${API_BASE_URL}assistant/conversation`,
    CHAT: `${API_BASE_URL}assistant/chat`,
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}auth/login`,
    SIGNUP: `${API_BASE_URL}auth/signup`,
  },
} as const;

export interface APIMessage {
  id: number;
  query: string;
  response: string;
  createdAt: string;
  intent?: string;
  contextData?: {
    lastRecommendations?: any[];
    referencedEventId?: number;
    referencedEventName?: string;
    [key: string]: any;
  };
}


export interface ConversationResponse {
  data: APIMessage[];
  meta: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
  };
}


export interface ChatResponse {
  response: string;
  intent?: {
    type: string;
    value: string;
  };
  contextData?: {
    lastRecommendations?: any[];
    event?: any;
    referencedEventId?: number;
  };
}


export interface ChatRequest {
  message: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  llm?: 'openai' | 'xai';
}

