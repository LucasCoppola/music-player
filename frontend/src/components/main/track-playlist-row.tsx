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
import { formatDuration } from "@/lib/utils";
import { useParams } from "@tanstack/react-router";
import { usePlayback } from "@/context/playback-context";

interface TrackPlaylistRowProps {
  track: Track;
  imageUrl: string;
  index: number;
}

export default function TrackPlaylistRow({
  track,
  imageUrl,
  index,
}: TrackPlaylistRowProps) {
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
  const isCurrentTrack = currentTrack?.title === track.title;

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleTrackAction = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (isCurrentTrack) {
        togglePlayPause();
      } else {
        playTrack(track);
      }
    },
    [isCurrentTrack, togglePlayPause, playTrack, track],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isCurrentTrack) {
          togglePlayPause();
        } else {
          playTrack(track);
        }
      }
    },
    [isCurrentTrack, togglePlayPause, playTrack, track],
  );

  return (
    <tr
      className="group cursor-pointer hover:bg-[#1A1A1A] select-none relative"
      tabIndex={0}
      onClick={handleTrackAction}
      onKeyDown={handleKeyDown}
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
            <div className="w-1 bg-neutral-600 animate-now-playing-1"></div>
            <div className="w-1 bg-neutral-600 animate-now-playing-2 [animation-delay:0.2s]"></div>
            <div className="w-1 bg-neutral-600 animate-now-playing-3 [animation-delay:0.4s]"></div>
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
        <div className="opacity-0 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-400 hover:text-white focus:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <Ellipsis className="size-4" />
                <span className="sr-only">Track options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 dark">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-xs">
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
