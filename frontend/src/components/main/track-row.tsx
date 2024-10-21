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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useAddTrackToFavorites,
  useAddTrackToPlaylist,
  usePlaylists,
  useRemoveTrackFromFavorites,
} from "@/hooks/use-playlists";
import { Track, useDeleteTrack } from "@/hooks/use-tracks";
import { formatDuration, highlightText } from "@/lib/utils";
import { usePlayback } from "@/context/playback-context";

interface TrackRowProps {
  track: Track;
  imageUrl: string;
  index: number;
  query?: string;
}

export default function TrackRow({
  track,
  imageUrl,
  index,
  query,
}: TrackRowProps) {
  const { data: playlists } = usePlaylists();
  const { currentTrack, playTrack, togglePlayPause, isPlaying } = usePlayback();
  const { mutate: deleteTrack } = useDeleteTrack();

  const { mutate: addTrackToPlaylist } = useAddTrackToPlaylist();
  const { mutate: addTrackToFavorites } = useAddTrackToFavorites();
  const { mutate: removeFromFavorites } = useRemoveTrackFromFavorites();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const isCurrentTrack = currentTrack?.title === track.title;

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleTrackAction = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
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

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAlertOpen(true);
    setIsMenuOpen(false);
  }, []);

  const handleDeleteConfirm = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteTrack({ id: track.id });
      setIsAlertOpen(false);
    },
    [deleteTrack, track.id],
  );

  const handleDeleteCancel = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAlertOpen(false);
  }, []);

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
              alt="Track cover"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-medium truncate max-w-[180px] sm:max-w-[200px] text-[#d1d5db]">
            {highlightText(track.title, query)}
          </div>
        </div>
      </td>
      <td className="py-[2px] px-2 text-[#d1d5db] max-w-40 truncate">
        {highlightText(track.artist, query)}
      </td>
      <td className="py-[2px] px-2 tabular-nums text-[#d1d5db]">
        {formatDuration(track.duration)}
      </td>
      <td className="py-[2px] px-2 text-right">
        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-primary/90 hover:text-primary focus:text-primary"
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
                    {playlists &&
                      playlists
                        .filter((p) => p.type === "regular")
                        .map((playlist) => (
                          <DropdownMenuItem
                            className="text-xs"
                            key={playlist.id}
                            onClick={(e) => {
                              e.stopPropagation();
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
                {track.favorite ? (
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromFavorites({ trackId: track.id });
                    }}
                  >
                    <HeartOff className="mr-2 size-3 fill-primary" />
                    Remove from Favorites
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      addTrackToFavorites({ trackId: track.id });
                    }}
                  >
                    <Heart className="mr-2 size-3" />
                    Add to Favorites
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={handleDeleteClick}
                  >
                    <Trash className="mr-2 size-3" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent className="dark text-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Track?</AlertDialogTitle>
                <AlertDialogDescription>
                  The track will be permanently deleted. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleDeleteCancel}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-500 text-foreground"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
}
