import TracksTable from "@/components/main/tracks-table";
import { useTracks } from "@/hooks/use-tracks";
import { createFileRoute, useSearch } from "@tanstack/react-router";

function TracksComponent() {
  const { q } = useSearch({ from: "/" });
  const { data: tracks, isLoading } = useTracks(q);

  return <TracksTable tracks={tracks} isLoading={isLoading} source="all" />;
}

export const Route = createFileRoute("/")({
  component: TracksComponent,
  validateSearch: (search: { q?: string }) => {
    return {
      q: search.q ?? "",
    };
  },
});
