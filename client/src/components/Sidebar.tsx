import { useEffect, useRef } from "react";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  width?: number;
  children: React.ReactNode;
  ariaLabel?: string;
};

export function Sidebar({
  open,
  onClose,
  width = 320,
  ariaLabel = "Sidebar",
  children,
}: SidebarProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onClick, true);
    return () => document.removeEventListener("mousedown", onClick, true);
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden
        className={[
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      />
      <aside
        ref={panelRef}
        role="complementary"
        aria-label={ariaLabel}
        aria-hidden={!open}
        className={[
          "fixed top-0 left-0 z-50 h-dvh max-h-screen bg-neutral-900/95 border-r border-white/10",
          "shadow-2xl will-change-transform transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ width }}
      >
        <div className="sticky top-0 z-10 flex items-center gap-2 px-3 h-12 border-b border-white/10 bg-neutral-900/80 backdrop-blur">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/10 focus:outline-none focus:ring focus:ring-white/20"
            aria-label="Close sidebar"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <span className="text-sm text-white/70">Chats</span>
        </div>
        <div className="overflow-y-auto h-[calc(100dvh-3rem)]">{children}</div>
      </aside>
    </>
  );
}
