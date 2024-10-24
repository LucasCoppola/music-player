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
import { usePlayback } from "@/context/playback-context";
import { useEffect, useState } from "react";

export default function Playlist() {
  const { setPlaylist, playTrack } = usePlayback();
  const { playlistId } = useParams({ from: "/p/$playlistId" });
  const { data: playlist, isLoading } = usePlaylistById(playlistId);
  const [playRandom, setPlayRandom] = useState(() => {
    const savedPlayRandom = localStorage.getItem(`playRandom_${playlistId}`);
    return savedPlayRandom === "true";
  });

  useEffect(() => {
    localStorage.setItem(`playRandom_${playlistId}`, playRandom.toString());
  }, [playRandom, playlistId]);

  if (isLoading) {
    return <PlaylistLoadingSkeleton />;
  }

  function PlayAll() {
    if (playlist) {
      if (playRandom) {
        const shuffledPlaylist = [...playlist.tracks].sort(
          () => Math.random() - 0.5,
        );
        setPlaylist(shuffledPlaylist);
        playTrack(shuffledPlaylist[0]);
      } else {
        setPlaylist(playlist.tracks);
        playTrack(playlist.tracks[0]);
      }
    }
  }

  return (
    <>
      {playlist && (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A] pb-[69px]">
          <div className="flex items-center justify-between p-3 bg-[#0A0A0A]">
            <div className="flex items-center space-x-1">
              <Link to=".." search={{ q: "" }}>
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
                onClick={PlayAll}
              >
                Play All
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setPlayRandom((prevState) => !prevState)}
              >
                {playRandom ? (
                  <Shuffle className="w-4 h-4 text-green-500" />
                ) : (
                  <Shuffle className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center py-3 px-4 space-x-3 bg-[#0A0A0A]">
            {playlist?.type === "favorite" ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/images/defaults/${playlist.image_name}`}
                  alt="Favorite playlist cover"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <CoverImage
                coverImage={playlist.image_name ?? null}
                playlistId={playlist.id}
              />
            )}
            <div>
              {playlist?.type === "favorite" ? (
                <h1 className="text-xl sm:text-2xl font-bold">
                  {playlist.title}
                </h1>
              ) : (
                <EditableTitle
                  playlistId={playlist.id}
                  initialName={playlist.title}
                />
              )}
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
