import { Ellipsis, Pause, Play, Plus, Trash } from "lucide-react";
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
import { useAddTrackToPlaylist, usePlaylists } from "@/hooks/use-playlists";
import { useState } from "react";
import { Track, useDeleteTrack } from "@/hooks/use-tracks";

export default function TrackRow({
  track,
  imageUrl,
  index,
}: {
  track: Track;
  imageUrl: string;
  index: number;
}) {
  const { data: playlists } = usePlaylists();
  const { mutate: deleteTrack } = useDeleteTrack();
  const { mutate: addTrackToPlaylist } = useAddTrackToPlaylist();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCurrentTrack = true;
  const isPlaying = false;

  return (
    <tr className="group cursor-pointer hover:bg-[#1A1A1A] select-none relative">
      <td className="py-[2px] pl-3 pr-2 tabular-nums w-10 text-center text-gray-400">
        {index}
      </td>
      <td className="py-[2px] px-2">
        <div className="flex items-center">
          <div className="relative size-5 mr-2">
            <img src={imageUrl} alt="Album cover" className="object-cover" />
          </div>
          <div className="font-medium truncate max-w-[180px] sm:max-w-[200px] text-[#d1d5db]">
            {track.title}
          </div>
        </div>
      </td>
      <td className="py-[2px] px-2 text-[#d1d5db] max-w-40 truncate">
        {track.artist}
      </td>
      <td className="py-[2px] px-2 tabular-nums text-[#d1d5db]">3:21</td>
      <td className="py-[2px] px-2 text-right">
        <div className="opacity-0 group-hover:opacity-100">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-400 hover:text-white focus:text-white"
              >
                <Ellipsis className="size-4" />
                <span className="sr-only">Track options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 dark">
              <AlertDialog>
                <DropdownMenuItem className="text-xs">
                  {isCurrentTrack && isPlaying ? (
                    <>
                      <Pause className="mr-2 size-3 stroke-[1.5]" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 size-3 stroke-[1.5]" />
                      Play
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="text-xs">
                    <Plus className="mr-2 size-3" />
                    Add to Playlist
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-48">
                    {playlists &&
                      playlists.map((playlist) => (
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
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-xs"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash className="mr-2 size-3" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark text-foreground">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Track?</AlertDialogTitle>
                    <AlertDialogDescription>
                      The track will be permanently deleted. This action cannot
                      be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsMenuOpen(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-500 text-foreground"
                      onClick={() => {
                        deleteTrack({ id: track.id });
                        setIsMenuOpen(false);
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}
