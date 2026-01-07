
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  energyData?: {
    level: number;
    name: string;
    currentImagePrompt: string;
    idealImagePrompt: string;
    currentImageUrl?: string;
    idealImageUrl?: string;
  };
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
