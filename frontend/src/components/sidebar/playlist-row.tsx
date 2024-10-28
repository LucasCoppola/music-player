import { useState, useRef } from "react";
import { Playlist, useDeletePlaylist } from "@/hooks/use-playlists";
import { Link, useLocation } from "@tanstack/react-router";
import { MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PlaylistRow({ playlist }: { playlist: Playlist }) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const { mutate: deletePlaylist } = useDeletePlaylist();
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  function handleDeleteClick(e: Event) {
    e.preventDefault();
    setIsAlertDialogOpen(true);
  }

  function handleDeleteConfirm() {
    deletePlaylist({ id: playlist.id });
    setIsAlertDialogOpen(false);
    menuTriggerRef.current?.focus();
  }

  function handleDeleteCancel() {
    setIsAlertDialogOpen(false);
    menuTriggerRef.current?.focus();
  }

  return (
    <li className="group relative">
      <Link
        to={`/p/${playlist.id}`}
        className={`block py-1 px-4 cursor-pointer hover:bg-[#1A1A1A] text-[#d1d5db] 
          focus:outline-none focus:ring-[0.5px] focus:ring-gray-400
          ${pathname === `/p/${playlist.id}` ? "bg-[#1A1A1A]" : ""}`}
        tabIndex={0}
      >
        {playlist.title}
      </Link>

      {playlist.type !== "favorite" && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                ref={menuTriggerRef}
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Playlist options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 dark">
              <AlertDialog
                open={isAlertDialogOpen}
                onOpenChange={setIsAlertDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={handleDeleteClick}
                    className="text-xs"
                  >
                    <Trash className="mr-2 size-3" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark text-foreground">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Playlist?</AlertDialogTitle>
                    <AlertDialogDescription>
                      The playlist will be permanently deleted along with all
                      its tracks. This action cannot be undone.
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </li>
  );
}
