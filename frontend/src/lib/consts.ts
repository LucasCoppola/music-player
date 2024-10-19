export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const queryKeys = {
  playlists: () => ["playlists"],
  playlist: (id: string) => ["playlist", id],
  tracks: () => ["tracks"],
};
