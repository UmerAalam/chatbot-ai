import { createFileRoute } from "@tanstack/react-router";
import "../styles.css";
import HomePage from "src/pages/HomePage";
export const Route = createFileRoute("/")({
  component: HomePage,
});
