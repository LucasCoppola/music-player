import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import { Track } from "@/hooks/use-tracks";
import { PlaybackContext } from "@/context/playback-context";
import { getCoverTrackImage } from "@/lib/utils";

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [isCurrentFavorite, setIsCurrentFavorite] = useState(false);

  useEffect(() => {
    if (currentTrack) {
      setCurrentImageUrl(getCoverTrackImage(currentTrack.image_name));
      setIsCurrentFavorite(currentTrack.favorite);
    }
  }, [currentTrack]);

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
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.src = getAudioSrc(track.track_name);
      audioRef.current.play();
    }
  }, []);

  const playNextTrack = useCallback(() => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (track) => track.id === currentTrack.id,
      );
      const nextIndex = (currentIndex + 1) % playlist.length;
      playTrack(playlist[nextIndex]);
    }
  }, [currentTrack, playlist, playTrack]);

  const playPreviousTrack = useCallback(() => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (track) => track.id === currentTrack.id,
      );
      const previousIndex =
        (currentIndex - 1 + playlist.length) % playlist.length;
      playTrack(playlist[previousIndex]);
    }
  }, [currentTrack, playlist, playTrack]);

  const getAudioSrc = (track_name: string) => {
    return `${import.meta.env.VITE_BASE_URL}/tracks/${track_name}`;
  };

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
        currentImageUrl,
        setCurrentImageUrl,
        isCurrentFavorite,
        setIsCurrentFavorite,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}
