import { usePlayback } from "@/context/playback-context";
import TrackInfo from "./track-info";
import PlaybackButtons from "./playback-buttons";
import ProgressBar from "./progress-bar";
import Volume from "./volume";
import { useEffect } from "react";

export default function PlaybackControls() {
  const { audioRef, setCurrentTime, setDuration } = usePlayback();

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
      };
    }
  }, [audioRef, setCurrentTime, setDuration]);

  return (
    <div className="bg-[#181818] border-t border-[#282828] flex flex-col pb-[calc(0.5rem+env(safe-area-inset-bottom))] p-2">
      <div className="flex items-center justify-between">
        <audio ref={audioRef} />
        <TrackInfo />
        <div className="flex flex-col items-center justify-center w-1/3">
          <PlaybackButtons />
          <ProgressBar />
        </div>
        <Volume />
      </div>
    </div>
  );
}
