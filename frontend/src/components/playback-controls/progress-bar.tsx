import { usePlayback } from "@/context/playback-context";
import { formatDuration } from "@/lib/utils";
import { useRef } from "react";

export default function ProgressBar() {
  const { currentTime, duration, audioRef, setCurrentTime } = usePlayback();
  const progressBarRef = useRef<HTMLDivElement>(null);

  function handleProgressChange(e: React.MouseEvent<HTMLDivElement>) {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const newTime = (percentage / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }

  return (
    <div className="w-full flex items-center mt-1">
      <span className="text-xs tabular-nums text-gray-400">
        {formatDuration(currentTime)}
      </span>
      <div
        ref={progressBarRef}
        className="flex-grow mx-2 h-1 bg-[#3E3E3E] rounded-full cursor-pointer relative"
        onClick={handleProgressChange}
      >
        <div
          className="absolute top-0 left-0 h-full bg-white rounded-full"
          style={{
            width: `${(currentTime / duration) * 100}%`,
          }}
        ></div>
      </div>
      <div className="text-xs tabular-nums text-gray-400">
        {formatDuration(duration)}
      </div>
    </div>
  );
}
