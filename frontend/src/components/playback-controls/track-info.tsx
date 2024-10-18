import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayback } from "@/context/playback-context";
import {
  useRemoveTrackFromFavorites,
  useAddTrackToFavorites,
} from "@/hooks/use-playlists";
import { useLocation } from "@tanstack/react-router";

export default function TrackInfo() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const {
    currentTrack,
    currentImageUrl,
    setIsCurrentFavorite,
    isCurrentFavorite,
  } = usePlayback();

  const playlistId = pathname.split("/")[2];
  const { mutate: addTrackToFavorites } = useAddTrackToFavorites(playlistId);
  const { mutate: removeTrackFromFavorites } =
    useRemoveTrackFromFavorites(playlistId);

  function handleAddToFavorites() {
    setIsCurrentFavorite(true);
    if (currentTrack?.id) {
      addTrackToFavorites({ trackId: currentTrack.id });
    }
  }

  function handleRemoveFromFavorites() {
    setIsCurrentFavorite(false);
    if (currentTrack?.id) {
      removeTrackFromFavorites({ trackId: currentTrack.id });
    }
  }

  return (
    <div className="flex items-center w-1/3 space-x-2">
      {currentTrack && (
        <>
          <img
            src={currentImageUrl}
            alt="Track thumbnail"
            className="w-10 h-10 object-cover mr-2"
          />
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium truncate max-w-[120px] sm:max-w-[200px] text-gray-200">
                {currentTrack.title}
              </div>
              <div className="text-xs text-gray-400 truncate max-w-[120px] sm:max-w-[200px]">
                {currentTrack.artist}
              </div>
            </div>
            {isCurrentFavorite ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-primary/90 hover:text-primary focus:text-primary ml-4"
                onClick={handleRemoveFromFavorites}
              >
                <HeartIcon className="size-4 fill-primary" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-primary/90 hover:text-primary focus:text-primary ml-4"
                onClick={handleAddToFavorites}
              >
                <HeartIcon className="size-4" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
