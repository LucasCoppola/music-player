import { Ellipsis, Pause, Play, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../ui/dropdown-menu";
import { playlists, tracks } from "@/lib/consts";

export default function TracksTable() {
  const imageUrl =
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  return (
    <table className="w-full text-xs">
      <thead className="sticky top-0 bg-[#0A0A0A] z-10 border-b border-[#282828]">
        <tr className="text-left text-gray-400">
          <th className="py-2 pl-3 pr-2 font-medium w-10">#</th>
          <th className="py-2 px-2 font-medium">Title</th>
          <th className="py-2 px-2 font-medium hidden sm:table-cell">Artist</th>
          <th className="py-2 px-2 font-medium hidden md:table-cell">Album</th>
          <th className="py-2 px-2 font-medium">Duration</th>
          <th className="py-2 px-2 font-medium w-8"></th>
        </tr>
      </thead>
      <tbody className="mt-[1px]">
        {tracks.map((track, i) => (
          <TrackRow track={track} imageUrl={imageUrl} key={i} index={i + 1} />
        ))}
      </tbody>
    </table>
  );
}

function TrackRow({
  track,
  imageUrl,
  index,
}: {
  track: (typeof tracks)[number];
  imageUrl: string;
  index: number;
}) {
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
      <td className="py-[2px] px-2 text-[#d1d5db]">{track.album}</td>
      <td className="py-[2px] px-2 tabular-nums text-[#d1d5db]">
        {track.duration}
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
                  {playlists.map((playlist, i) => (
                    <DropdownMenuItem className="text-xs" key={i}>
                      {playlist.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}
