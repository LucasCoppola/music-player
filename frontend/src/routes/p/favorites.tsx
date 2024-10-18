import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/p/favorites")({
  component: () => <div>Hello /p/favorites!</div>,
});
