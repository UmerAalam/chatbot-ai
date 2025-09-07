export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: never;
          name: string;
        };
        Update: {
          id?: never;
          name?: string;
        };
        Delete: {
          id: number;
        };
      };
    };
  };
}
