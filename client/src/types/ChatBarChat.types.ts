export interface ChatBarChat {
  id?: number;
  folder_id?: string;
  chat_name: string;
  email: string;
  created_at?: string;
}
export interface RenameChatBarChat {
  id: number;
  chat_name: string;
}
