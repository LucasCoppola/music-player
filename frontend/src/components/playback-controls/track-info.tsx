import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayback } from "@/context/playback-context";
import {
  useRemoveTrackFromFavorites,
  useAddTrackToFavorites,
} from "@/hooks/use-playlists";
import { useImageFile } from "@/hooks/use-files";
import { getUrlFromBlob } from "@/lib/utils";
import { DEFAULT_COVER_TRACK_IMAGE } from "@/lib/consts";

export default function TrackInfo() {
  const { currentTrack } = usePlayback();
  const { mutate: addTrackToFavorites } = useAddTrackToFavorites();
  const { mutate: removeTrackFromFavorites } = useRemoveTrackFromFavorites();
  const { data: imageBlob } = useImageFile(currentTrack?.image_name ?? "");
  const imageUrl = imageBlob
    ? getUrlFromBlob(imageBlob)
    : DEFAULT_COVER_TRACK_IMAGE;

  return (
    <div className="flex items-center w-1/3 space-x-2">
      {currentTrack && (
        <>
          <img
            src={imageUrl}
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
            {currentTrack.favorite ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-primary/90 hover:text-primary focus:text-primary ml-4"
                onClick={() => {
                  if (currentTrack?.id) {
                    removeTrackFromFavorites({ trackId: currentTrack.id });
                  }
                }}
              >
                <HeartIcon className="size-4 fill-primary" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-primary/90 hover:text-primary focus:text-primary ml-4"
                onClick={() => {
                  if (currentTrack?.id) {
                    addTrackToFavorites({ trackId: currentTrack.id });
                  }
                }}
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
