declare const puter: {
  ai: {
    chat: (prompt: string, options?: { model?: string }) => Promise<string>;
    txt2img: (prompt: string, options?: object) => Promise<HTMLImageElement>;
  };
  print: (data: any) => void;
};
