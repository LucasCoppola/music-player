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
  useAddTrackToPlaylist,
  usePlaylists,
  useRemoveTrackFromPlaylist,
} from "@/hooks/use-playlists";
import { Track } from "@/hooks/use-tracks";
import { formatDuration } from "@/lib/utils";
import { useParams } from "@tanstack/react-router";

export default function TrackPlaylistRow({
  track,
  imageUrl,
  index,
}: {
  track: Track;
  imageUrl: string;
  index: number;
}) {
  const { playlistId } = useParams({
    from: "/playlist/$playlistId",
  });
  const { data } = usePlaylists();
  const { mutate: addTrackToPlaylist } = useAddTrackToPlaylist();
  const { mutate: removeTrackFromPlaylist } = useRemoveTrackFromPlaylist();
  const playlists = data?.filter((p) => p.id !== playlistId);

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
              >
                <Ellipsis className="size-4" />
                <span className="sr-only">Track options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 dark">
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
              <DropdownMenuItem
                className="text-xs"
                onSelect={(e) => e.preventDefault()}
                onClick={() => removeTrackFromPlaylist({ trackId: track.id })}
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
