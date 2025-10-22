
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatBotProps {
  onClose?: () => void;
  title?: string;
  placeholder?: string;
  initialMessages?: Message[];
}

