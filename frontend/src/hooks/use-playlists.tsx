import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";

type Playlist = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  image_path: string;
};

export function usePlaylist() {
  const { authState } = useAuth();

  return useQuery({
    queryKey: ["playlists"],
    queryFn: async (): Promise<Array<Playlist>> => {
      if (!authState?.token) return [];

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/playlists`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        },
      );
      return await response.json();
    },
    enabled: !!authState?.token,
  });
}

export function usePlaylistById(playlistId: string) {
  const { authState } = useAuth();

  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async (): Promise<Playlist> => {
      if (!authState?.token) throw new Error("Unauthorized");

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/playlists/${playlistId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        },
      );

      return await response.json();
    },
    enabled: !!authState?.token && !!playlistId,
  });
}
