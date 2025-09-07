import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
      queryClient.invalidateQueries({ queryKey: ["chatbarchats"] });
    },
  });

  return mutation;
};
const userChatBarChats = (email: string) => {
  return queryOptions({
    queryFn: async () => {
      const res = await client.api.chatbarchat.$get({
        query: { email },
      });
      const data = await res.json();
      return data;
    },
    queryKey: ["chatbarchats"],
    enabled: !!email,
  });
};
export const useUserChatBarChats = (email: string) => {
  return useQuery(userChatBarChats(email));
};
