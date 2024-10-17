import { useAuth } from "@/context/auth-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useClient } from "./utils";

export type Track = {
  id: string;
  title: string;
  artist: string;
  user_id: string;
  track_name: string;
  image_name: string | null;
  duration: number;
  bit_rate: number;
};

type UploadFile = {
  trackId?: string;
  message: string;
  file_name: string;
  mimetype: string;
  size_in_kb: number;
};

export function useTracks(query: string) {
  const { authState } = useAuth();
  const authToken = authState?.token;

  const client = useClient();

  return useQuery({
    queryKey: ["tracks", query],
    queryFn: async (): Promise<Track[]> => {
      if (!authToken) throw new Error("Unauthorized");

      return await client(
        `${import.meta.env.VITE_BASE_URL}/api/tracks?q=${query}`,
        {
          method: "GET",
          headers: {
            contentType: "application/json",
            authToken,
          },
        },
      );
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
        `${import.meta.env.VITE_BASE_URL}/api/tracks/upload/audio`,
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

export function useUploadTrackCoverImage() {
  const queryClient = useQueryClient();
  const { authState } = useAuth();
  const authToken = authState?.token;

  const client = useClient();

  return useMutation({
    mutationFn: async ({
      file,
      trackId,
    }: {
      file: File;
      trackId: string;
    }): Promise<{ message: string; image_name: string }> => {
      if (!authToken) throw new Error("Unauthorized");

      const formData = new FormData();
      formData.append("image", file);

      return await client(
        `${import.meta.env.VITE_BASE_URL}/api/tracks/${trackId}/upload/image`,
        {
          method: "POST",
          headers: {
            authToken,
          },
          body: formData,
        },
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      toast.success(data.message || "Track cover image uploaded successfully.");
    },
    onError: (e) => {
      console.error("Failed to upload cover image", e);
      toast.error(e.message || "Failed to upload cover image");
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
      track_name,
      mimetype,
      size_in_kb,
    }: {
      title: string;
      artist: string;
      track_name: string;
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
          track_name,
          mimetype,
          size_in_kb,
        }),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      toast.success(data.message || "Track created successfully.");
    },
    onError: (e) => {
      console.error("Failed to create track", e);
      toast.error(e.message || "Failed to create track");
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      toast.success(data.message || "Track deleted successfully.");
    },
    onError: (e) => {
      console.error("Failed to delete track", e);
      toast.error(e.message || "Failed to delete track");
    },
  });
}
