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
  const filename = currentTrack?.image_name
    ? `${currentTrack.image_name}-large.webp`
    : null;
  const { data: imageBlob } = useImageFile(filename);
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
            className="w-8 h-8 sm:w-10 sm:h-10 object-cover sm:mr-2"
          />
          <div className="flex items-center">
            <div>
              <div className="text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-[200px] text-gray-200">
                {currentTrack.title}
              </div>
              <div className="text-[11px] sm:text-xs text-gray-400 truncate max-w-[100px] sm:max-w-[200px]">
                {currentTrack.artist}
              </div>
            </div>
            {currentTrack.favorite ? (
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:block size-7 text-primary/90 hover:text-primary focus:text-primary ml-4"
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
                className="hidden sm:block size-7 text-primary/90 hover:text-primary focus:text-primary ml-4"
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
