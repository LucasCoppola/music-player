import { useAuth } from "@/context/auth-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useClient } from "./utils";

export type Track = {
  id: string;
  title: string;
  artist: string;
  user_id: string;
  track_file_path: string;
};

type UploadFile = {
  track_file_path: string;
  mimetype: string;
  size_in_kb: number;
};

export function useTracks() {
  const { authState } = useAuth();
  const authToken = authState?.token;

  const client = useClient();

  return useQuery({
    queryKey: ["tracks"],
    queryFn: async (): Promise<Track[]> => {
      if (!authToken) throw new Error("Unauthorized");

      return await client(`${import.meta.env.VITE_BASE_URL}/api/tracks`, {
        method: "GET",
        headers: {
          contentType: "application/json",
          authToken,
        },
      });
    },
    enabled: !!authToken,
  });
}

export function useUploadTrackFile() {
  const { authState } = useAuth();
  const authToken = authState?.token;

  const client = useClient();

  return useMutation({
    mutationFn: async ({ file }: { file: File }): Promise<UploadFile> => {
      if (!authToken) throw new Error("Unauthorized");

      const formData = new FormData();
      formData.append("track", file);

      return await client(
        `${import.meta.env.VITE_BASE_URL}/api/tracks/upload`,
        {
          method: "POST",
          headers: {
            authToken,
          },
          body: formData,
        },
      );
    },
    onError: (e) => {
      console.error("Failed to upload track", e);
    },
  });
}

export function useCreateTrack() {
  const queryClient = useQueryClient();
  const { authState } = useAuth();
  const authToken = authState?.token;

  const client = useClient();

  return useMutation({
    mutationFn: async ({
      title,
      artist,
      track_file_path,
      mimetype,
      size_in_kb,
    }: {
      title: string;
      artist: string;
      track_file_path: string;
      mimetype: string;
      size_in_kb: number;
    }) => {
      if (!authToken) throw new Error("Unauthorized");

      return await client(`${import.meta.env.VITE_BASE_URL}/api/tracks`, {
        method: "POST",
        headers: {
          contentType: "application/json",
          authToken,
        },
        body: JSON.stringify({
          title,
          artist,
          track_file_path,
          mimetype,
          size_in_kb,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      toast.success("Track created successfully.");
    },
    onError: (e) => {
      console.error("Failed to create track", e);
      toast.error("Failed to create track");
    },
  });
}

export function useDeleteTrack() {
  const queryClient = useQueryClient();
  const { authState } = useAuth();
  const authToken = authState?.token;

  const client = useClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!authToken) throw new Error("Unauthorized");

      return await client(`${import.meta.env.VITE_BASE_URL}/api/tracks/${id}`, {
        method: "DELETE",
        headers: {
          contentType: "application/json",
          authToken,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      toast.success("Track deleted successfully.");
    },
    onError: (e) => {
      console.error("Failed to delete track", e);
      toast.error("Failed to delete track");
    },
  });
}
