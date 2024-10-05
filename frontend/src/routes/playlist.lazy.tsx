import Playlist from "@/components/main/playlist";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/playlist")({
  component: Playlist,
});
