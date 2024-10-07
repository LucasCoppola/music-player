import { useAuth } from "@/context/auth-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Playlist = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  image_path: string;
};

export function usePlaylists() {
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

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  const { authState } = useAuth();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!authState?.token) throw new Error("Unauthorized");

      const newPlaylist = {
        id,
        title,
        owner_id: authState?.userId,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/playlists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify(newPlaylist),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create playlist");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast.success("Playlist created successfully.");
    },
    onError: (e) => {
      console.error("Failed to create playlist", e);
      toast.error("Failed to create playlist");
    },
  });
}
