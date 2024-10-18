import { HeartIcon, HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayback } from "@/context/playback-context";
import { useCallback, useState } from "react";

export default function TrackInfo() {
  const { currentTrack, currentImageUrl } = usePlayback();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

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
            {currentTrack.favorite ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-primary/90 hover:text-primary focus:text-primary ml-4"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {isHovered ? (
                  <HeartOff className="size-4 fill-primary" />
                ) : (
                  <HeartIcon className="size-4 fill-primary" />
                )}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-primary/90 hover:text-primary focus:text-primary ml-4"
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
