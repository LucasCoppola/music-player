import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayback } from "@/context/playback-context";

export default function TrackInfo() {
  const { currentTrack, currentImageUrl } = usePlayback();

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
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 hover:bg-zinc-900"
            >
              <HeartIcon className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
