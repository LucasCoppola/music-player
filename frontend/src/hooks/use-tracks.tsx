import { useAuth } from "@/context/auth-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type Track = {
  id: string;
  title: string;
  artist: string;
  user_id: string;
  track_file_path: string;
};

export function useTracks() {
  const { authState } = useAuth();

  return useQuery({
    queryKey: ["tracks"],
    queryFn: async (): Promise<Array<Track>> => {
      if (!authState?.token) return [];

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/tracks`,
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

export function useUploadTrackFile() {
  const { authState } = useAuth();

  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      if (!authState?.token) throw new Error("Unauthorized");
      const formData = new FormData();
      formData.append("track", file);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/tracks/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw data;
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Track uploaded successfully.");
    },
    onError: (e) => {
      console.error("Failed to upload track", e);
      toast.error("Failed to upload track");
    },
  });
}

// export function useCreateTrack() {
//   const queryClient = useQueryClient();
//   const { authState } = useAuth();
//
//   return useMutation({
//     mutationFn: async ({ title }: { title: string }) => {
//       if (!authState?.token) throw new Error("Unauthorized");
//
//       const response = await fetch(
//         `${import.meta.env.VITE_BASE_URL}/api/playlists`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${authState.token}`,
//           },
//           body: JSON.stringify(newPlaylist),
//         },
//       );
//
//       if (!response.ok) {
//         throw new Error("Failed to create playlist");
//       }
//
//       return await response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["playlists"] });
//       toast.success("Playlist created successfully.");
//     },
//     onError: (e) => {
//       console.error("Failed to create playlist", e);
//       toast.error("Failed to create playlist");
//     },
//   });
// }
