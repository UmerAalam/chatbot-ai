import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "src/lib/client";
import { ChatBarChat } from "src/types/ChatBarChat.types";

export const useChatBarChatPost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (chat: ChatBarChat) => {
      const res = await client.api.chatbarchat.$post({
        json: chat,
      });
      if (!res.ok) {
        throw new Error("Error while posting chatbarchat");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatBarChats"] });
    },
  });

  return mutation;
};

export const useChatBarChatsGet = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (chat: ChatBarChat) => {
      const res = await client.api.chatbarchat.$post({
        json: chat,
      });
      if (!res.ok) {
        throw new Error("Error while posting chatbarchat");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatBarChats"] });
    },
  });

  return mutation;
};
