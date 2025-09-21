import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { client } from "src/lib/client";
import { getUser } from "src/supabase-client/supabase-client";

export interface Chat {
  id?: number;
  text: string;
  chatbar_id: number;
  created_at?: string;
  email?: string;
  role: string;
}
interface RenameChat {
  id: number;
  text: string;
}
export const useChatCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync } = useMutation({
    mutationFn: async (chat: Chat) => {
      const user = await getUser();
      if (!user) {
        return navigate({ to: "/" });
      }
      const res = await client.api.chats.$post({
        json: {
          chatbar_id: chat.chatbar_id,
          text: chat.text,
          role: chat.role,
          email: (user && user.email) || "",
        },
      });
      if (!res.ok) throw new Error("Error while posting chat");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
  return mutateAsync;
};
export const useChatDelete = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (chatbar_id: number) => {
      const res = await client.api.chats.$delete({
        json: { chatbar_id },
      });
      if (!res.ok) {
        throw new Error("Error while deleting chat");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
  return mutation;
};
export const useChatRename = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (chat: RenameChat) => {
      const res = await client.api.chats.$patch({
        json: chat,
      });
      if (!res.ok) {
        throw new Error("Error while renaming chat");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
  return mutation;
};

const userChatsByChatBarChatID = (chatbar_id: string) => {
  return queryOptions({
    queryFn: async () => {
      const res = await client.api.chats.$get({ query: { chatbar_id } });
      if (!res.ok) {
        throw new Error("Error Getting Folders");
      }
      const data = await res.json();
      return data.data as Chat[];
    },
    queryKey: ["chats", chatbar_id],
    enabled: !!chatbar_id,
  });
};
export const useChatsByChatBarID = (chatbar_id: string) => {
  return useQuery(userChatsByChatBarChatID(chatbar_id));
};
