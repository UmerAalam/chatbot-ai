import { useFolders } from "src/query/folder";
import ChatFolder from "./ChatFolder";
import { useEffect, useMemo, useState } from "react";

interface FolderProps {
  name: string;
  folder_id: string;
}
interface Props {
  searchTerm: string;
  showChatFolder: ({ name, folder_id }: FolderProps) => void;
}
const FoldersList = ({ searchTerm, showChatFolder }: Props) => {
  const [email, setEmail] = useState("");
  const { data: folders, isLoading: folderLoading } = useFolders(email);
  console.log(folders);
  useEffect(() => {
    const stored = localStorage.getItem("email");
    if (stored) setEmail(stored);
  }, []);
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
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full">
      {items.map((folder) => (
        <div key={folder.id} className="w-full py-1.5 h-auto">
          <ChatFolder
            id={folder.id}
            currentName={folder.folder_name}
            onRowClick={(name) => {
              folder.id &&
                showChatFolder({ name, folder_id: folder.id.toString() });
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FoldersList;
