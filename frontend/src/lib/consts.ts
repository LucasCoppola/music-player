import travolta from "../images/confused-travolta.gif";
import heart from "../images/heart.png";
import defaultCover from "../images/default_cover_track_image.png";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const DEFAULT_VOLUME = 0.1;

export const DEFAULT_COVER_TRACK_IMAGE = defaultCover;

export const DEFAULT_FAVORITE_COVER = heart;

export const NOT_FOUND_IMAGE = travolta;

export const queryKeys = {
  playlists: () => ["playlists"],
  playlist: (id: string) => ["playlist", id],
  tracks: () => ["tracks"],
  track: (id: string) => ["track", id],
};
