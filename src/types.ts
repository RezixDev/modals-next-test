// types.ts
export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }
  
  export interface ChatResponse {
    response: string;
    error?: string;
  }
 
  
