import { useFolders } from "src/query/folder";
import ChatFolder from "./ChatFolder";
import { useMemo } from "react";
import { useAuth } from "src/lib/FetchUser";
import { Loader2 } from "lucide-react";

interface FolderProps {
  name: string;
  folder_id: string;
}
interface Props {
  searchTerm: string;
  showChatFolder: ({ name, folder_id }: FolderProps) => void;
}
const FoldersList = ({ searchTerm, showChatFolder }: Props) => {
  const { user } = useAuth();
  const email = user?.email || "";
  const { data: folders, isLoading: folderLoading } = useFolders(email);
  const items = useMemo(() => {
    if (!folders) return [];
    const list = searchTerm.trim()
      ? folders.filter((folder) =>
          folder.folder_name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : folders;
    return [...list].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [searchTerm, folders]);
  if (folderLoading) {
    return (
      <div className="w-full flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-white/70" />
      </div>
    );
  }
  return (
    <div className="w-full">
      {items.map((folder) => (
        <div key={folder.id} className="w-full py-1.5 h-auto">
          <ChatFolder
            id={folder.id}
            currentName={folder.folder_name}
            onRowClick={(name) => {
              folder.id && showChatFolder({ name, folder_id: folder.id.toString() });
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FoldersList;
