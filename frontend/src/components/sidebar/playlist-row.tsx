import { Playlist, useDeletePlaylist } from "@/hooks/use-playlists";
import { Link, useLocation } from "@tanstack/react-router";
import { MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
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
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function PlaylistRow({ playlist }: { playlist: Playlist }) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const { mutate } = useDeletePlaylist();

  return (
    <li className="group relative">
      <Link
        to={`/playlist/${playlist.id}`}
        className={`block py-1 px-4 cursor-pointer hover:bg-[#1A1A1A] text-[#d1d5db] 
          focus:outline-none focus:ring-[0.5px] focus:ring-gray-400
          ${pathname === `/playlist/${playlist.id}` ? "bg-[#1A1A1A]" : ""}`}
        tabIndex={0}
      >
        {playlist.title}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-sm"
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Playlist options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 dark">
              <DropdownMenuItem
                className="text-xs"
                onSelect={(e) => {
                  e.preventDefault();
                  setIsAlertDialogOpen(true);
                }}
              >
                <Trash className="mr-2 size-3" />
                Delete
              </DropdownMenuItem>
              <AlertDialog
                open={isAlertDialogOpen}
                onOpenChange={setIsAlertDialogOpen}
              >
                <AlertDialogContent className="dark text-foreground">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Playlist?</AlertDialogTitle>
                    <AlertDialogDescription>
                      The playlist will be permanently deleted along with all
                      its tracks. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAlertDialogOpen(false);
                      }}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-500 text-foreground"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAlertDialogOpen(false);
                        mutate({ id: playlist.id });
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
      </Link>
    </li>
  );
}
