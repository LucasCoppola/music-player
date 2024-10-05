import TracksTable from "@/components/main/tracks-table";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: TracksTable,
});
