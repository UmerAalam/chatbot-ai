import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import {
  useChatBarChatDelete,
  useChatBarChatRename,
} from "src/query/chatbarchat";

type Props = {
  id?: number;
  name: string;
};

function ChatShortcut({ id, name: currentName }: Props) {
  const [open, setOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(currentName);
  const navigate = useNavigate();
  const { mutate: deleteChat } = useChatBarChatDelete();
  const { mutate: renameChat } = useChatBarChatRename();

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

  const handleDelete = () => {
    if (id != null) deleteChat(id);
    setOpen(false);
  };

  const startRenaming = () => {
    setOpen(false);
    setIsRenaming(true);
    setName(currentName);
  };

  const confirmRename = () => {
    const trimmed = name.trim();
    if (id != null && trimmed) {
      renameChat({ id, chat_name: trimmed });
    }
    setIsRenaming(false);
  };

  return (
    <div className="relative flex items-center text-white/80 font-semibold px-3 w-full h-12 bg-gray-700/50 rounded-2xl border-l-8 border-white outline-2 outline-transparent hover:outline-white">
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 top-12 bg-gray-800/80 backdrop-blur-2xl text-white/90 rounded-lg shadow-lg border border-gray-700/50 w-40 z-50"
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          role="menu"
        >
          <ul className="flex flex-col text-sm">
            <li
              onClick={startRenaming}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-t-lg"
              role="menuitem"
            >
              Rename
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              role="menuitem"
            >
              Move
            </li>
            <li
              onClick={handleDelete}
              className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-b-lg text-red-400 hover:text-red-300"
              role="menuitem"
            >
              Delete
              <MdDelete className="ml-2" size={16} />
            </li>
          </ul>
        </div>
      )}

      <div
        onClick={() => navigate({ to: `/chatpage/${id}` })}
        className="select-none w-full h-full flex items-center justify-between"
      >
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
              className="flex-1 text-left truncate cursor-pointer hover:opacity-90"
              title={currentName}
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
              className="rounded-full hover:bg-gray-700/70 p-1 cursor-pointer"
            >
              <HiDotsHorizontal className="text-white/80" size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatShortcut;
