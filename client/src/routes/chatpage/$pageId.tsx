import { createFileRoute, useParams } from "@tanstack/react-router";
import ChatPage from "src/pages/ChatPage";

export const Route = createFileRoute("/chatpage/$pageId")({
  component: RouteComponent,
});

function RouteComponent() {
  const pageId = useParams({ from: "/chatpage/$pageId" }).pageId;
  return <ChatPage chatbar_id={Number(pageId)} />;
}
