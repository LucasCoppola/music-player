import { Track } from "@/hooks/use-tracks";
import { createContext, useContext } from "react";

type PlaybackContextType = {
  isPlaying: boolean;
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  togglePlayPause: () => void;
  playTrack: (track: Track) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaylist: (tracks: Track[]) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
};

export const PlaybackContext = createContext<PlaybackContextType | undefined>(
  undefined,
);

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (context === undefined) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }
  return context;
}
