import React, { useCallback, useState } from "react";
import {
  Ellipsis,
  Heart,
  HeartOff,
  Pause,
  Play,
  Plus,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  useAddTrackToFavorites,
  useAddTrackToPlaylist,
  usePlaylists,
  useRemoveTrackFromFavorites,
  useRemoveTrackFromPlaylist,
} from "@/hooks/use-playlists";
import { Track } from "@/hooks/use-tracks";
import { formatDuration, getUrlFromBlob } from "@/lib/utils";
import { useParams } from "@tanstack/react-router";
import { usePlayback } from "@/context/playback-context";
import { useImageFile } from "@/hooks/use-files";
import { DEFAULT_COVER_TRACK_IMAGE } from "@/lib/consts";

export default function TrackPlaylistRow({
  track,
  index,
}: {
  track: Track;
  index: number;
}) {
  const { playlistId } = useParams({
    from: "/p/$playlistId",
  });
  const { data: playlists } = usePlaylists();
  const { mutate: addTrackToPlaylist } = useAddTrackToPlaylist();
  const { mutate: removeTrackFromPlaylist } = useRemoveTrackFromPlaylist();
  const { mutate: addTrackToFavorites } = useAddTrackToFavorites();
  const { mutate: removeFromFavorites } = useRemoveTrackFromFavorites();

  const availablePlaylists = playlists?.filter(
    (p) => p.id !== playlistId && p.type === "regular",
  );
  const isFavoritePlaylist =
    playlists?.find((p) => p.id === playlistId)?.type === "favorite";

  const { currentTrack, playTrack, togglePlayPause, isPlaying } = usePlayback();
  const isCurrentTrack = currentTrack?.id === track.id;
  const filename = track?.image_name ? `${track.image_name}-small.webp` : null;
  const { data: imageBlob } = useImageFile(filename);
  const imageUrl = imageBlob
    ? getUrlFromBlob(imageBlob)
    : DEFAULT_COVER_TRACK_IMAGE;

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  function handleTrackAction(e: React.MouseEvent) {
    e.preventDefault();
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  }

  return (
    <tr
      className={`group cursor-pointer hover:bg-[#1A1A1A] select-none relative ${
        isCurrentTrack ? "bg-[#2A2A2A] hover:bg-[#2A2A2A]" : ""
      }`}
      tabIndex={0}
      onClick={handleTrackAction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <td className="py-[2px] pl-3 pr-2 tabular-nums w-10 text-center text-gray-400">
        {isHovered ? (
          isPlaying && isCurrentTrack ? (
            <Pause className="ml-1 size-3" />
          ) : (
            <Play className="ml-1 size-3" />
          )
        ) : isCurrentTrack && isPlaying ? (
          <div className="flex items-end justify-center space-x-[2px] size-[0.65rem] mx-auto">
            <div className="w-1 bg-neutral-400 animate-now-playing-1"></div>
            <div className="w-1 bg-neutral-400 animate-now-playing-2 [animation-delay:0.2s]"></div>
            <div className="w-1 bg-neutral-400 animate-now-playing-3 [animation-delay:0.4s]"></div>
          </div>
        ) : (
          <span className="text-gray-400">{index}</span>
        )}
      </td>
      <td className="py-[2px] px-2">
        <div className="flex items-center">
          <div className="relative size-5 mr-2">
            <img
              src={imageUrl}
              alt="Album cover"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-medium truncate max-w-[180px] sm:max-w-[200px] text-[#d1d5db]">
            {track.title}
          </div>
        </div>
      </td>
      <td className="py-[2px] px-2 text-[#d1d5db] max-w-40 truncate">
        {track.artist}
      </td>
      <td className="py-[2px] px-2 tabular-nums text-[#d1d5db]">
        {formatDuration(track.duration)}
      </td>
      <td className="py-[2px] px-2 text-right">
        <div className="sm:opacity-0 sm:group-hover:opacity-100 flex items-center space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-muted-foreground sm:text-primary/90 sm:hover:text-primary focus:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <Ellipsis className="size-4" />
                <span className="sr-only">Track options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 dark">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus className="mr-2 size-3" />
                  Add to Playlist
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
                  {availablePlaylists &&
                    availablePlaylists.map((playlist) => (
                      <DropdownMenuItem
                        className="text-xs"
                        key={playlist.id}
                        onSelect={() => {
                          addTrackToPlaylist({
                            trackId: track.id,
                            playlistId: playlist.id,
                          });
                        }}
                      >
                        {playlist.title}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              {isFavoritePlaylist ? (
                <DropdownMenuItem
                  className="text-xs"
                  onSelect={() => {
                    removeFromFavorites({ trackId: track.id });
                  }}
                >
                  <HeartOff className="mr-2 size-3 fill-primary" />
                  Remove from Favorites
                </DropdownMenuItem>
              ) : track.favorite ? (
                <DropdownMenuItem
                  className="text-xs"
                  onSelect={() => {
                    removeFromFavorites({ trackId: track.id });
                  }}
                >
                  <HeartOff className="mr-2 size-3 fill-primary" />
                  Remove from Favorites
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-xs"
                  onSelect={() => {
                    addTrackToFavorites({ trackId: track.id });
                  }}
                >
                  <Heart className="mr-2 size-3" />
                  Add to Favorites
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTrackFromPlaylist({ trackId: track.id, playlistId });
                }}
              >
                <Trash className="mr-2 size-3" />
                Delete from Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}
