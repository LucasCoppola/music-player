import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";

type Playlists = {
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
    queryFn: async (): Promise<Array<Playlists>> => {
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
