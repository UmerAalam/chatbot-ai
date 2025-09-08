import { useFolders } from "src/query/folder";
import ChatFolder from "./ChatFolder";
import { useState } from "react";

interface Props {
  searchTerm: string;
  showChatFolder: (name: string) => void;
}
const FoldersList = ({ searchTerm, showChatFolder }: Props) => {
  const email = localStorage.getItem("email") || "";
  const { data: folders, isLoading: folderLoading } = useFolders(email);
  const [folderId, setFolderId] = useState("");
  if (folderLoading && folders) {
    return <div>Loading</div>;
  }
  return (
    <div className="w-full">
      {!searchTerm.trim() &&
        folders
          ?.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateA - dateB;
          })
          .reverse()
          .map((folder, index) => {
            return (
              <div key={index} className="w-full py-1.5 h-auto">
                <ChatFolder
                  onRowClick={(name) => {
                    folder.id && setFolderId(folder.id.toString());
                    showChatFolder(name);
                  }}
                  id={folder.id}
                  currentName={folder.folder_name}
                />
              </div>
            );
          })}
      {searchTerm.trim() &&
        folders
          ?.filter((f) =>
            f.folder_name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateA - dateB;
          })
          .reverse()
          .map((folder) => (
            <div className="w-full py-1.5 h-auto" key={folder.id}>
              <ChatFolder
                id={folder.id}
                currentName={folder.folder_name}
                onRowClick={(name) => {
                  folder.id && setFolderId(folder.id.toString());
                  showChatFolder(name);
                }}
              />
            </div>
          ))}
    </div>
  );
};
export default FoldersList;
