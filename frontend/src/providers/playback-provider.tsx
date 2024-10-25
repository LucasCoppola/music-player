import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import { Track, useTrackById } from "@/hooks/use-tracks";
import { PlaybackContext } from "@/context/playback-context";
import { BASE_URL } from "@/lib/consts";

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: currentTrack } = useTrackById(currentTrackId || "");

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.src = getAudioSrc(track.track_name, track.user_id);
      audioRef.current.play();
    }
  }, []);

  const playNextTrack = useCallback(() => {
    if (currentTrack && playlist && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (track) => track.id === currentTrack.id,
      );
      const nextIndex = (currentIndex + 1) % playlist.length;
      playTrack(playlist[nextIndex]);
    }
  }, [currentTrack, playlist, playTrack]);

  const playPreviousTrack = useCallback(() => {
    if (currentTrack && playlist && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (track) => track.id === currentTrack.id,
      );
      const previousIndex =
        (currentIndex - 1 + playlist.length) % playlist.length;
      playTrack(playlist[previousIndex]);
    }
  }, [currentTrack, playlist, playTrack]);

  function getAudioSrc(track_name: string, userId: string) {
    return `${BASE_URL}/${userId}/tracks/${track_name}`;
  }

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[type="search"]',
        ) as HTMLInputElement | null;
        searchInput?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [togglePlayPause]);

  return (
    <PlaybackContext.Provider
      value={{
        isPlaying,
        currentTrack,
        currentTrackId,
        currentTime,
        duration,
        togglePlayPause,
        playTrack,
        playNextTrack,
        playPreviousTrack,
        setCurrentTime,
        setDuration,
        setPlaylist,
        audioRef,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}
