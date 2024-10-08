import { Plus } from "lucide-react";
import Auth from "../auth/auth";
import SearchInput from "./search";
import { buttonVariants } from "@/components/ui/button";
import UploadTrack from "./upload-track";
import UserDropdown from "./user-dropdown";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-context";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useCreatePlaylist, usePlaylists } from "@/hooks/use-playlists";

export default function Sidebar() {
  const { authState, logout } = useAuth();
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const { data: playlists } = usePlaylists();

  const newPlaylist = {
    id: crypto.randomUUID(),
    title: "New Playlist",
  };

  const { mutate: createPlaylist } = useCreatePlaylist();

  return (
    <div className="w-56 bg-[#121212] flex flex-col h-full">
      <div className="m-4 mb-6">
        <div className="space-y-2">
          {authState?.isAuthenticated ? (
            <UserDropdown authState={authState} logout={logout} />
          ) : (
            <Auth />
          )}
          <SearchInput />
        </div>
      </div>
      <div className="mb-6">
        <Link
          to="/"
          className={`block py-1 px-4 text-xs text-[#d1d5db] hover:bg-[#1A1A1A] transition-colors 
            focus:outline-none focus:ring-[0.5px] focus:ring-gray-400 ${pathname === "/" ? "bg-[#1A1A1A]" : ""}`}
        >
          All Tracks
        </Link>
      </div>

      <div className="flex items-center justify-between dark mb-4 px-4">
        <span className="text-xs font-semibold text-gray-400">Playlists</span>
        <Link
          to="/playlist/$playlistId"
          params={{ playlistId: newPlaylist.id }}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-5 w-5",
          )}
          onClick={() => createPlaylist(newPlaylist)}
        >
          <Plus className="h-3 w-3" />
          <span className="sr-only">Add Playlist</span>
        </Link>
      </div>

      <ScrollArea className="h-[calc(100dvh-180px)]">
        {authState?.isAuthenticated && (
          <ul className="space-y-0.5 text-xs mt-[1px]">
            {playlists &&
              playlists.map((playlist, i) => (
                <li key={i} className="group relative">
                  <Link
                    to={`/playlist/${playlist.id}`}
                    className={`block py-1 px-4 cursor-pointer hover:bg-[#1A1A1A] text-[#d1d5db] 
                      focus:outline-none focus:ring-[0.5px] focus:ring-gray-400 
                      ${pathname === `/playlist/${playlist.id}` ? "bg-[#1A1A1A]" : ""}`}
                    tabIndex={0}
                  >
                    {playlist.title}
                  </Link>
                </li>
              ))}
          </ul>
        )}
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <div className="m-4">
        <UploadTrack isAuthenticated={authState?.isAuthenticated} />
      </div>
    </div>
  );
}
