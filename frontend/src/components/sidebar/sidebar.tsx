import { Plus } from "lucide-react";
import Auth from "../auth/auth";
import SearchInput from "./search";
import { buttonVariants } from "@/components/ui/button";
import UploadTrack from "./upload/upload-track";
import UserDropdown from "./user-dropdown";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-context";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useCreatePlaylist, usePlaylists } from "@/hooks/use-playlists";
import PlaylistRow from "./playlist-row";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { CloseSidebarIcon, OpenSidebarIcon } from "../ui/icons";

export default function Sidebar() {
  const { authState, logout } = useAuth();
  const pathname = useLocation({ select: (location) => location.pathname });
  const { data: playlists } = usePlaylists();
  const { mutate: createPlaylist } = useCreatePlaylist();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const newPlaylist = {
    id: uuidv4(),
    title: "New Playlist",
  };

  return (
    <>
      <button
        className={cn(
          "fixed bottom-20 left-4 z-50 p-2 rounded-md transition-all duration-200 ease-in-out",
          "bg-[#121212] hover:bg-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-gray-400",
          "sm:hidden",
          isSidebarOpen && "left-[232px]",
        )}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <CloseSidebarIcon /> : <OpenSidebarIcon />}
      </button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-56 bg-[#121212] flex-col h-full transform transition-transform duration-300 ease-in-out",
          "sm:relative sm:transform-none",
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full sm:translate-x-0",
        )}
      >
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
        <div className="mb-4 space-y-1">
          <Link
            to="/"
            search={{ q: "" }}
            className={`block py-1 px-4 text-xs text-[#d1d5db] hover:bg-[#1A1A1A] transition-colors 
            focus:outline-none focus:ring-[0.5px] focus:ring-gray-400 ${pathname === "/" ? "bg-[#1A1A1A]" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            All Tracks
          </Link>
        </div>

        <div className="flex items-center justify-between dark mb-4 px-4">
          <span className="text-xs font-semibold text-gray-400">Playlists</span>
          <Link
            to="/p/$playlistId"
            params={{ playlistId: newPlaylist.id }}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-5 w-5",
            )}
            onClick={() => {
              createPlaylist(newPlaylist);
              setIsSidebarOpen(false);
            }}
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">Add Playlist</span>
          </Link>
        </div>

        <ScrollArea className="h-[calc(100dvh-180px)]">
          {authState?.isAuthenticated && (
            <ul className="space-y-0.5 text-xs mt-[1px]">
              {playlists &&
                playlists.map((playlist) => (
                  <PlaylistRow
                    playlist={playlist}
                    key={playlist.id}
                    setIsSidebarOpen={setIsSidebarOpen}
                  />
                ))}
            </ul>
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <div className="m-4">
          <UploadTrack isAuthenticated={authState?.isAuthenticated} />
        </div>
      </div>
    </>
  );
}
