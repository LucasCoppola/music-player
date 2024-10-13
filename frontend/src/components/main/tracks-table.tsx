import { Track } from "@/hooks/use-tracks";
import { imageUrl } from "@/lib/consts";
import TrackRow from "./tracks-row";
import { TracksTableSkeleton } from "../skeletons";

export default function TracksTable({
  tracks,
  isLoading = false,
}: {
  tracks: Track[] | undefined;
  isLoading?: boolean;
}) {
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
              <th className="py-2 px-2 font-medium hidden sm:table-cell">
                Artist
              </th>
              <th className="py-2 px-2 font-medium">Duration</th>
              <th className="py-2 px-2 font-medium w-8"></th>
            </tr>
          </thead>
          <tbody className="mt-[1px]">
            {tracks && tracks.length > 0 ? (
              tracks.map((track, i) => (
                <TrackRow
                  track={track}
                  imageUrl={imageUrl}
                  key={i}
                  index={i + 1}
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
