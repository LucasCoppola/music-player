import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import { Track, useTrackById } from "@/hooks/use-tracks";
import { PlaybackContext } from "@/context/playback-context";
import { getAudioBlob, getUrlFromBlob } from "@/lib/utils";

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [previousTrackId, setPreviousTrackId] = useState<string | null>(null);

  const { data: currentTrack } = useTrackById(currentTrackId || "");

  useEffect(() => {
    async function loadAudio() {
      if (currentTrack?.track_name && currentTrackId !== previousTrackId) {
        const audioBlob = await getAudioBlob(currentTrack.track_name);
        if (audioBlob && audioRef.current) {
          const audioUrl = getUrlFromBlob(audioBlob)!;
          audioRef.current.src = audioUrl;
          if (isPlaying) audioRef.current.play();
        }
        setPreviousTrackId(currentTrackId);
      }
    }
    loadAudio();
  }, [currentTrack, currentTrackId, isPlaying, previousTrackId]);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        setCurrentTime(audioRef.current.currentTime);
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const playTrack = useCallback(
    (track: Track) => {
      if (currentTrackId !== track.id) {
        setCurrentTrackId(track.id);
        setCurrentTime(0);
        setIsPlaying(true);
      }
    },
    [currentTrackId],
  );

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

  const stopPlayback = useCallback(
    (trackId: string) => {
      if (trackId === currentTrackId && audioRef.current) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
          setIsPlaying(false);
          setCurrentTrackId(null);
          setCurrentTime(0);
        }
      }
    },
    [currentTrackId],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("ended", playNextTrack);
      return () => {
        audio.removeEventListener("ended", playNextTrack);
      };
    }
  }, [playNextTrack]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement
        ) {
          return;
        }
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
        stopPlayback,
        audioRef,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}
