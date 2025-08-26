import { createFileRoute } from "@tanstack/react-router";
import ChatPage from "src/pages/ChatPage";
export const Route = createFileRoute("/chatpage/")({
  loader: async () => {
    //
  },
  component: ChatPage,
});
