import { createFileRoute } from "@tanstack/react-router";
import SignUpPage from "src/pages/SignUpPage";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
});
