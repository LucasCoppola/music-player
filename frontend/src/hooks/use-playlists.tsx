import { useAuth } from "@/context/auth-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useClient } from "./utils";

type Playlist = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  image_path: string;
};

export function usePlaylists() {
  const { authState } = useAuth();
  const client = useClient();

  return useQuery({
    queryKey: ["playlists"],
    queryFn: async (): Promise<Playlist[]> => {
      if (!authState?.token) return [];

      return await client(`${import.meta.env.VITE_BASE_URL}/api/playlists`, {
        method: "GET",
        headers: {
          contentType: "application/json",
          authToken: authState.token,
        },
      });
    },
    enabled: !!authState?.token,
  });
}

export function usePlaylistById(playlistId: string) {
  const { authState } = useAuth();
  const client = useClient();

  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async (): Promise<Playlist> => {
      if (!authState?.token) throw new Error("Unauthorized");

      return await client(
        `${import.meta.env.VITE_BASE_URL}/api/playlists/${playlistId}`,
        {
          method: "GET",
          headers: {
            contentType: "application/json",
            authToken: authState.token,
          },
        },
      );
    },
    enabled: !!authState?.token && !!playlistId,
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  const { authState } = useAuth();
  const client = useClient();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!authState?.token) throw new Error("Unauthorized");

      const newPlaylist = {
        id,
        title,
        owner_id: authState?.userId,
      };

      return await client(`${import.meta.env.VITE_BASE_URL}/api/playlists`, {
        method: "POST",
        headers: {
          contentType: "application/json",
          authToken: authState.token,
        },
        body: JSON.stringify(newPlaylist),
      });
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

export function useUpdatePlaylistTitle() {
  const queryClient = useQueryClient();
  const { authState } = useAuth();
  const client = useClient();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!authState?.token) throw new Error("Unauthorized");

      return await client(
        `${import.meta.env.VITE_BASE_URL}/api/playlists/${id}`,
        {
          method: "PATCH",
          headers: {
            contentType: "application/json",
            authToken: authState.token,
          },
          body: JSON.stringify({ title }),
        },
      );
    },
    onSuccess: (data: Playlist) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", data.id] });
      toast.success("Playlist updated successfully.");
    },
    onError: (e) => {
      console.error("Failed to update playlist", e);
      toast.error("Failed to update playlist");
    },
  });
}
