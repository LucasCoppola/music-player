import { Track } from "@/hooks/use-tracks";

import travolta from "@/assets/images/confused-travolta.gif";
import heart from "@/assets/images/heart.png";
import defaultCover from "@/assets/images/default_cover_track_image.png";

import do_i from "@/assets/tracks/do_i.mp3";
import into_the_night from "@/assets/tracks/into_the_night.mp3";
import blind_girl from "@/assets/tracks/blind_girl.mp3";
import give_yourself_away from "@/assets/tracks/give_yourself_away.mp3";
import drip_too_hard from "@/assets/tracks/drip_too_hard.mp3";

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

export const demoTracks: Track[] = [
  {
    id: "af3da85b-6fec-4241-ab13-d9bc39dd0ff1",
    title: "Into The Night",
    artist: "UK Drill",
    user_id: "1",
    track_name: into_the_night,
    favorite: false,
    image_name: null,
    duration: 140,
    bit_rate: 256000,
    created_at: new Date(),
  },
  {
    id: "af3da85b-6fec-4241-ab13-d9bc39dd0ff2",
    title: "Drip Too Hard",
    artist: "Konstantin",
    user_id: "1",
    track_name: drip_too_hard,
    favorite: false,
    image_name: null,
    duration: 107,
    bit_rate: 324866,
    created_at: new Date(),
  },
  {
    id: "af3da85b-6fec-4241-ab13-d9bc39dd0ff3",
    title: "Give Yourself Away",
    artist: "Mickey Blue",
    user_id: "1",
    track_name: give_yourself_away,
    favorite: false,
    image_name: null,
    duration: 219,
    bit_rate: 178680,
    created_at: new Date(),
  },
  {
    id: "af3da85b-6fec-4241-ab13-d9bc39dd0ff4",
    title: "Blind Girl",
    artist: "Zero Project",
    user_id: "1",
    track_name: blind_girl,
    favorite: false,
    image_name: null,
    duration: 227,
    bit_rate: 192563,
    created_at: new Date(),
  },
  {
    id: "af3da85b-6fec-4241-ab13-d9bc39dd0ff5",
    title: "Do I",
    artist: "LEEONA",
    user_id: "1",
    track_name: do_i,
    favorite: false,
    image_name: null,
    duration: 167,
    bit_rate: 192297,
    created_at: new Date(),
  },
];
