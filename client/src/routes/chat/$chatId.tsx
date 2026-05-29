import { createFileRoute, useParams } from "@tanstack/react-router";
import ChatPage from "src/pages/ChatPage";

export const Route = createFileRoute("/chat/$chatId")({
  component: RouteComponent,
});

function RouteComponent() {
  const chatId = useParams({ from: "/chat/$chatId" }).chatId;
  return <ChatPage chatbar_id={chatId} />;
}
