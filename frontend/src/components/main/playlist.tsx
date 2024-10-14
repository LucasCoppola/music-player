import { Link, useParams } from "@tanstack/react-router";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { CoverImage } from "./cover-image";
import { EditableTitle } from "./editable-title";
import TracksTable from "./tracks-table";
import { usePlaylistById } from "@/hooks/use-playlists";
import { PlaylistLoadingSkeleton } from "../skeletons";
import { formatDuration } from "@/lib/utils";

export default function Playlist() {
  const { playlistId } = useParams({
    from: "/playlist/$playlistId",
  });
  const { data: playlist, isLoading } = usePlaylistById(playlistId);

  if (isLoading) {
    return <PlaylistLoadingSkeleton />;
  }

  return (
    <>
      {playlist && (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A] pb-[69px]">
          <div className="flex items-center justify-between p-3 bg-[#0A0A0A]">
            <div className="flex items-center space-x-1">
              <Link to="/">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <span className="text-sm">{playlist.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                className="h-7 text-xs bg-[#282828] hover:bg-[#3E3E3E] text-white"
              >
                Play All
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center py-3 px-4 space-x-3 bg-[#0A0A0A]">
            <CoverImage
              coverImage={playlist.image_name ?? null}
              playlistId={playlist.id}
            />
            <div>
              <EditableTitle
                playlistId={playlist.id}
                initialName={playlist.title}
              />
              <p className="text-xs sm:text-sm text-gray-400">
                {playlist.track_count} tracks •{" "}
                {formatDuration(playlist.duration)}
              </p>
            </div>
          </div>

          <ScrollArea className="flex-1 mt-3">
            <div className="min-w-max">
              <TracksTable tracks={playlist.tracks} source="playlist" />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </>
  );
}
