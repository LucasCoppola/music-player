import { Plus } from "lucide-react";
import Auth from "./auth/auth";
import SearchInput from "./search";
import { Button } from "./ui/button";
import UploadSong from "./upload-song";
import UserDropdown from "./user-dropdown";
import { playlists } from "@/lib/consts";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function Sidebar() {
  const isLoggedIn = false;

  return (
    <div className="w-56 p-4 bg-[#121212] flex flex-col h-full">
      <div className="space-y-2">
        {isLoggedIn ? <UserDropdown /> : <Auth />}
        <SearchInput />
      </div>

      <div className="text-xs mt-6">All Tracks</div>

      <div className="flex items-center justify-between dark mt-6">
        <span className="text-xs font-semibold text-gray-400">Playlists</span>
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <Plus className="h-3 w-3" />
          <span className="sr-only">Add Playlist</span>
        </Button>
      </div>

      <ScrollArea className="flex-grow mt-2">
        <div className="space-y-2 pb-4">
          {playlists.map((playlist, i) => (
            <div key={i} className="text-xs">
              {playlist.name}
            </div>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <div className="mt-4">
        <UploadSong />
      </div>
    </div>
  );
}
