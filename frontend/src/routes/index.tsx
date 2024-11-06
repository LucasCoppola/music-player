import TracksTable from "@/components/main/tracks-table";
import { useAuth } from "@/context/auth-context";
import { useTracks } from "@/hooks/use-tracks";
import { demoTracks } from "@/lib/consts";
import { createFileRoute, useSearch } from "@tanstack/react-router";

function TracksComponent() {
  const { q } = useSearch({ from: "/" });
  const { data: userTracks, isLoading } = useTracks(q);
  const { authState, isAuthLoading } = useAuth();
  const isAuthenticated = authState?.isAuthenticated;

  if (isAuthLoading) {
    return <TracksTable tracks={[]} isLoading={true} source="all" query={q} />;
  }

  const tracks = isAuthenticated ? userTracks : demoTracks;
  return (
    <TracksTable tracks={tracks} isLoading={isLoading} source="all" query={q} />
  );
}

export const Route = createFileRoute("/")({
  component: TracksComponent,
  validateSearch: (search: { q?: string }) => {
    return {
      q: search.q ?? "",
    };
  },
});
