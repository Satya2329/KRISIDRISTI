export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  category?: 'disease' | 'mandi' | 'weather' | 'general';
}