export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const DEFAULT_VOLUME = 0.1;

export const DEFAULT_COVER_TRACK_IMAGE = `${BASE_URL}/public/images/default_cover_track_image.png`;

export const DEFAULT_FAVORITE_COVER = `${BASE_URL}/public/images/heart.png`;

export const queryKeys = {
  playlists: () => ["playlists"],
  playlist: (id: string) => ["playlist", id],
  tracks: () => ["tracks"],
  track: (id: string) => ["track", id],
};
