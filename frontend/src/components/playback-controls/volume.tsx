import { Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayback } from "@/context/playback-context";
import { useEffect, useState } from "react";
import { Slider } from "../ui/slider";

export default function Volume() {
  const { audioRef, currentTrack } = usePlayback();
  const [prevVolume, setPrevVolume] = useState(0.15);
  const [volume, setVolume] = useState(0.15);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);

  function handleSliderChange(value: number[]) {
    const newVolume = value[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);

    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }

  function displayVolumeIcon(): JSX.Element {
    if (volume > 0 && volume <= 0.5) {
      return <Volume1 className="h-4 w-4" />;
    } else if (volume > 0.5) {
      return <Volume2 className="h-4 w-4" />;
    }

    return <VolumeX className="h-4 w-4" />;
  }

  function toggleMute() {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = prevVolume;
        setVolume(prevVolume); // triggers useEffect; that's why it works.
        setIsMuted(false);
      } else {
        setPrevVolume(volume);
        audioRef.current.volume = 0;
        setIsMuted(true);
        setVolume(0);
      }
    }
  }

  return (
    <div className="flex items-center w-1/3 justify-end pr-8">
      {currentTrack && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-zinc-900"
            onClick={toggleMute}
          >
            {displayVolumeIcon()}
          </Button>

          <Slider
            value={[volume]}
            onValueChange={handleSliderChange}
            className="w-24 cursor-pointer py-1.5"
            max={1}
            step={0.01}
            disabled={!currentTrack}
          />
        </>
      )}
    </div>
  );
}
