import { Plus } from "lucide-react";
import Auth from "../auth/auth";
import SearchInput from "./search";
import { buttonVariants } from "@/components/ui/button";
import UploadSong from "./upload-song";
import UserDropdown from "./user-dropdown";
import { playlists } from "@/lib/consts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-context";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = "/";
  const { authState, logout } = useAuth();

  return (
    <div className="w-56 p-4 bg-[#121212] flex flex-col h-full">
      <div className="space-y-2">
        {authState?.isAuthenticated ? (
          <UserDropdown authState={authState} logout={logout} />
        ) : (
          <Auth />
        )}
        <SearchInput />
      </div>

      <Link
        to="/"
        className={`block mt-6 py-1 px-4 -mx-4 text-xs text-[#d1d5db] hover:bg-[#1A1A1A] transition-colors focus:outline-none focus:ring-[0.5px] focus:ring-gray-400 ${
          pathname === "/" ? "bg-[#1A1A1A]" : ""
        }`}
      >
        All Tracks
      </Link>

      <div className="flex items-center justify-between dark mt-6">
        <span className="text-xs font-semibold text-gray-400">Playlists</span>
        <Link
          to="/playlist/$playlistId"
          params={{
            playlistId: "dc7c5dfb-af71-4fe1-8b73-48d9397ab2f3",
          }}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-5 w-5",
          )}
        >
          <Plus className="h-3 w-3" />
          <span className="sr-only">Add Playlist</span>
        </Link>
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
        <UploadSong isAuthenticated={authState?.isAuthenticated} />
      </div>
    </div>
  );
}
