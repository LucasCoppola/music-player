import { Track } from "@/hooks/use-tracks";
import { TracksTableSkeleton } from "../skeletons";
import TrackRow from "./track-row";
import TrackPlaylistRow from "./track-playlist-row";
import { usePlayback } from "@/context/playback-context";
import { useEffect } from "react";

export default function TracksTable({
  tracks,
  source,
  isLoading = false,
  query,
}: {
  tracks: Track[] | undefined;
  source: "all" | "playlist";
  isLoading?: boolean;
  query?: string;
}) {
  const TrackComponent = source === "all" ? TrackRow : TrackPlaylistRow;
  const { setPlaylist } = usePlayback();

  useEffect(() => {
    if (tracks) {
      setPlaylist(tracks);
    }
  }, [tracks, setPlaylist]);

  return (
    <>
      {isLoading ? (
        <TracksTableSkeleton />
      ) : (
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-[#0A0A0A] z-10 border-b border-[#282828]">
            <tr className="text-left text-gray-400">
              <th className="py-2 pl-3 pr-2 font-medium w-10">#</th>
              <th className="py-2 px-2 font-medium">Title</th>
              <th className="py-2 px-2 font-medium">Artist</th>
              <th className="py-2 px-2 font-medium">Duration</th>
              <th className="py-2 px-2 font-medium w-8"></th>
            </tr>
          </thead>
          <tbody className="mt-[1px]">
            {tracks && tracks.length > 0 ? (
              tracks.map((track, i) => (
                <TrackComponent
                  track={track}
                  key={i}
                  index={i + 1}
                  query={query}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4 text-muted-foreground"
                >
                  No tracks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}
