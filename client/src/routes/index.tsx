import { createFileRoute } from "@tanstack/react-router";
import HomePage from "src/pages/HomePage";
import "../styles.css";
export const Route = createFileRoute("/")({
  component: HomePage,
});
