import Playlist from "@/components/main/playlist";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/p/$playlistId")({
  component: Playlist,
});
