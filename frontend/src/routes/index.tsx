import TracksTable from "@/components/main/tracks-table";
import { useTracks } from "@/hooks/use-tracks";
import { createFileRoute } from "@tanstack/react-router";

function TracksComponent() {
  const { data: tracks, isLoading } = useTracks();

  return <TracksTable tracks={tracks} isLoading={isLoading} source="all" />;
}

export const Route = createFileRoute("/")({
  component: TracksComponent,
});
