import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useFolderDelete, useFolderRename } from "src/query/folder";

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, "id"> & {
  id?: number;
  currentName: string;
  onRowClick: (name: string) => void;
};

function ChatFolder({ id, onRowClick, currentName, ...rest }: Props) {
  const [open, setOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(currentName);

  const { mutate: deleteFolder } = useFolderDelete();
  const { mutate: renameFolder } = useFolderRename();

  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const handleFolderDelete = () => {
    if (id != null) deleteFolder(id);
    setOpen(false);
  };

  const startRenaming = () => {
    setOpen(false);
    setIsRenaming(true);
  };

  const confirmRename = () => {
    if (id != null && name.trim())
      renameFolder({ id, folder_name: name.trim() });
    setIsRenaming(false);
  };

  return (
    <div
      {...rest}
      className="relative cursor-pointer flex items-center text-white/80 font-semibold px-3 w-full h-12 bg-gray-700/50 rounded-2xl border-l-8 border-green-400 outline-2 outline-transparent hover:outline-white"
    >
      {open && (
        <div
          ref={menuRef}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute right-0 top-12 z-50 bg-gray-800/80 backdrop-blur-2xl text-white/90 rounded-lg shadow-lg border border-gray-700/50 w-40"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <ul className="flex flex-col text-sm">
            <li
              onClick={startRenaming}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-t-lg"
            >
              Rename
            </li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Move</li>
            <li
              onClick={handleFolderDelete}
              className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-b-lg text-red-400 hover:text-red-300"
            >
              Delete
              <MdDelete className="ml-2" size={16} />
            </li>
          </ul>
        </div>
      )}
      <div className="select-none w-full h-full flex items-center justify-between">
        {isRenaming ? (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent outline-none border-b border-white/20"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && confirmRename()}
            />
            <FaCheck
              onClick={confirmRename}
              className="text-white/80 rounded-full hover:bg-gray-700/70 p-1 cursor-pointer"
              size={24}
            />
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onRowClick(name)}
              className="flex-1 text-left truncate hover:opacity-90"
            >
              {currentName}
            </button>
            <button
              ref={triggerRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => {
                e.stopPropagation();
                setOpen((v) => !v);
              }}
              className="rounded-full hover:bg-gray-700/70 p-1"
            >
              <HiDotsHorizontal className="text-white/80" size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatFolder;
