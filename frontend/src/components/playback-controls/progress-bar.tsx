import { usePlayback } from "@/context/playback-context";
import { formatDuration } from "@/lib/utils";
import { Slider } from "../ui/slider";

export default function ProgressBar() {
  const { currentTime, duration, audioRef, setCurrentTime, currentTrack } =
    usePlayback();

  function handleSliderChange(value: number[]) {
    const newTime = (value[0] / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  }

  return (
    <div className="w-full flex items-center mt-1">
      <span className="text-xs tabular-nums text-gray-400">
        {formatDuration(currentTime)}
      </span>
      <Slider
        value={[(currentTime / duration) * 100]}
        onValueChange={handleSliderChange}
        className="mx-2 cursor-pointer py-1.5"
        max={100}
        step={0.1}
        disabled={!currentTrack}
      />
      <div className="text-xs tabular-nums text-gray-400">
        {formatDuration(duration)}
      </div>
    </div>
  );
}
