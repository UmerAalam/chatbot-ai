export interface ChatBarChat {
  id?: number;
  folderId?: string;
  chat_name: string;
  email: string;
  created_at?: string;
}
export interface RenameChatBarChat {
  id: number;
  chat_name: string;
}
