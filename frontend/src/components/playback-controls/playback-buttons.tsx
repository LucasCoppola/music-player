import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayback } from "@/context/playback-context";

export default function PlaybackButtons() {
  const {
    isPlaying,
    togglePlayPause,
    playPreviousTrack,
    playNextTrack,
    currentTrack,
  } = usePlayback();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={playPreviousTrack}
        disabled={!currentTrack}
      >
        <SkipBack className="h-4 w-4 stroke-[1.5]" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={togglePlayPause}
        disabled={!currentTrack}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 stroke-[1.5]" />
        ) : (
          <Play className="w-5 h-5 stroke-[1.5]" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={playNextTrack}
        disabled={!currentTrack}
      >
        <SkipForward className="h-4 w-4 stroke-[1.5]" />
      </Button>
    </div>
  );
}
