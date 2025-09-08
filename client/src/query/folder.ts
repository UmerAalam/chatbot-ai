import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { client } from "src/lib/client";

interface Folder {
  id?: number;
  email: string;
  folder_name: string;
}
interface RenameFolder {
  id: number;
  folder_name: string;
}
export const useFolderCreate = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (folder: Folder) => {
      const res = await client.api.folder.$post({
        json: folder,
      });
      if (!res.ok) {
        throw new Error("Error while posting folder");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
  return mutation;
};
export const useFolderDelete = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await client.api.folder.$delete({
        json: { id },
      });
      if (!res.ok) {
        throw new Error("Error while deleting folder");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
  return mutation;
};
export const useFolderRename = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (folder: RenameFolder) => {
      const res = await client.api.folder.$patch({
        json: folder,
      });
      if (!res.ok) {
        throw new Error("Error while renaming folder ");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
  return mutation;
};
const userFoldersByEmail = (email: string) => {
  return queryOptions({
    queryFn: async () => {
      const res = await client.api.folder.$get({
        query: { email },
      });
      if (!res.ok) {
        throw new Error("Error Getting Folders");
      }
      const data = await res.json();
      return data.data as Folder[];
    },
    queryKey: ["folders"],
    enabled: !!email,
  });
};
export const useFolders = (email: string) => {
  return useQuery(userFoldersByEmail(email));
};
