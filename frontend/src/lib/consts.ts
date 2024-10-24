export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const DEFAULT_VOLUME = 0.1;

export const queryKeys = {
  playlists: () => ["playlists"],
  playlist: (id: string) => ["playlist", id],
  tracks: () => ["tracks"],
  track: (id: string) => ["track", id],
};
