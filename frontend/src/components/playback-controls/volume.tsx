import { Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayback } from "@/context/playback-context";
import { useCallback, useEffect, useState } from "react";
import { Slider } from "../ui/slider";
import { DEFAULT_VOLUME } from "@/lib/consts";

export default function Volume() {
  const { audioRef, currentTrack } = usePlayback();
  const [prevVolume, setPrevVolume] = useState(DEFAULT_VOLUME);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);

  const adjustVolume = useCallback(
    (delta: number) => {
      const newVolume = Math.max(0, Math.min(1, volume + delta));
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      }
    },
    [audioRef, isMuted, volume],
  );

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowUp" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        adjustVolume(0.05);
      } else if (e.key === "ArrowDown" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        adjustVolume(-0.05);
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [adjustVolume]);

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
      return <Volume1 className="size-4" />;
    } else if (volume > 0.5) {
      return <Volume2 className="size-4" />;
    }

    return <VolumeX className="size-4" />;
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
    <div className="w-1/3 pr-2 sm:pr-8">
      {currentTrack && (
        <div className="flex justify-end items-center">
          <div className="flex group">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 hover:bg-[#181818]"
              onClick={toggleMute}
            >
              {displayVolumeIcon()}
            </Button>

            <Slider
              value={[volume]}
              onValueChange={handleSliderChange}
              className="w-16 sm:w-24 cursor-pointer py-1.5"
              max={1}
              step={0.01}
              disabled={!currentTrack}
            />
          </div>
        </div>
      )}
    </div>
  );
}
