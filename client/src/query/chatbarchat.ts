import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { client } from "src/lib/client";
import type {
  ChatBarChat,
  RenameChatBarChat,
} from "src/types/ChatBarChat.types";

export const useChatBarChatCreate = () => {
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
export const useChatBarChatDelete = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await client.api.chatbarchat.$delete({
        json: { id },
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
export const useChatBarChatRename = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (chat: RenameChatBarChat) => {
      const res = await client.api.chatbarchat.$patch({
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
const userChatsByFolderID = (folder_id: string) => {
  return queryOptions({
    queryFn: async () => {
      const res = await client.api.chatbarchat.folderID.$get({
        query: { folder_id },
      });
      if (!res.ok) {
        throw new Error("Error Getting ChatBarChats");
      }
      const data = await res.json();
      return data.data as ChatBarChat[];
    },
    queryKey: ["chatbarchats"],
    enabled: !!folder_id,
  });
};
export const useChatsByFolderID = (folder_id: string) => {
  return useQuery(userChatsByFolderID(folder_id));
};
//userChatBarChats
const userChatBarChats = (email: string) => {
  return queryOptions({
    queryFn: async () => {
      const res = await client.api.chatbarchat.$get({
        query: { email },
      });
      if (!res.ok) {
        throw new Error("Error Getting ChatBarChats");
      }
      const data = await res.json();
      return data.data as ChatBarChat[];
    },
    queryKey: ["chatbarchats"],
    enabled: !!email,
  });
};
export const useUserChatBarChats = (email: string) => {
  return useQuery(userChatBarChats(email));
};
