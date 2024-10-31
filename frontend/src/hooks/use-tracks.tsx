import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useClient } from "./use-client";
import { BASE_URL, queryKeys } from "@/lib/consts";
import { useAuth } from "@/context/auth-context";

export type Track = {
  id: string;
  title: string;
  artist: string;
  user_id: string;
  track_name: string;
  favorite: boolean;
  image_name: string | null;
  duration: number;
  bit_rate: number;
  created_at: Date;
};

type UploadAudio = {
  message: string;
  track_name: string;
  mimetype: string;
  size_in_kb: number;
};

export type UploadImage = {
  message: string;
  image_name: string;
  large_image_size_in_kb: number;
  small_image_size_in_kb: number;
  mimetype: string;
};

export function useTracks(query: string) {
  const authToken = useAuth().authState?.token;
  const client = useClient<Track[]>();

  return useQuery({
    queryKey: queryKeys.tracks(),
    queryFn: () =>
      client(`${BASE_URL}/api/tracks?q=${query}`, authToken, { method: "GET" }),
    enabled: !!authToken,
  });
}

export function useTrackById(trackId: string) {
  const authToken = useAuth().authState?.token;
  const client = useClient<Track>();

  return useQuery({
    queryKey: queryKeys.track(trackId),
    queryFn: () =>
      client(`${BASE_URL}/api/tracks/${trackId}`, authToken, {
        method: "GET",
      }),
    enabled: !!authToken && !!trackId,
  });
}

export function useUploadTrackAudioFile() {
  const authToken = useAuth().authState?.token;
  const client = useClient<UploadAudio>();

  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const formData = new FormData();
      formData.append("track", file);

      return await client(`${BASE_URL}/api/tracks/upload/audio`, authToken, {
        method: "POST",
        body: formData,
      });
    },
    onError: (e) => {
      console.error("Failed to upload track", e);
    },
  });
}

export function useUploadTrackCoverImage() {
  const authToken = useAuth().authState?.token;
  const client = useClient<UploadImage>();

  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const formData = new FormData();
      formData.append("image", file);

      return await client(`${BASE_URL}/api/tracks/upload/image`, authToken, {
        method: "POST",
        body: formData,
      });
    },
    onError: (e) => {
      console.error("Failed to upload cover image", e);
    },
  });
}

export function useCreateTrack() {
  const authToken = useAuth().authState?.token;
  const queryClient = useQueryClient();
  const client = useClient<{ message: string }>();

  return useMutation({
    mutationFn: async ({
      title,
      artist,
      track_name,
      audio_mimetype,
      audio_size_in_kb,
      image_name,
      image_mimetype,
      large_image_size_in_kb,
      small_image_size_in_kb,
    }: {
      title: string;
      artist: string;
      track_name: string;
      audio_mimetype: string;
      audio_size_in_kb: number;
      image_name: string | null;
      image_mimetype: string | null;
      large_image_size_in_kb: number | null;
      small_image_size_in_kb: number | null;
    }) =>
      await client(`${BASE_URL}/api/tracks`, authToken, {
        method: "POST",
        headers: { contentType: "application/json" },
        body: {
          title,
          artist,
          track_name,
          audio_mimetype,
          audio_size_in_kb,
          image_name,
          image_mimetype,
          large_image_size_in_kb,
          small_image_size_in_kb,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks() });
      toast.success(data.message || "Track created successfully.");
    },
    onError: (e) => {
      console.error("Failed to create track", e);
      toast.error(e.message || "Failed to create track");
    },
  });
}

export function useUpdateTrack() {
  const authToken = useAuth().authState?.token;
  const queryClient = useQueryClient();
  const client = useClient<{ message: string; trackId: string }>();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      artist,
      image_name,
      mimetype,
      large_image_size_in_kb,
      small_image_size_in_kb,
    }: {
      id: string;
      title?: string;
      artist?: string;
      image_name?: string;
      mimetype?: string;
      large_image_size_in_kb?: number;
      small_image_size_in_kb?: number;
    }) =>
      await client(`${BASE_URL}/api/tracks/${id}`, authToken, {
        method: "PATCH",
        headers: { contentType: "application/json" },
        body: {
          title: title ?? null,
          artist: artist ?? null,
          image_name: image_name ?? null,
          mimetype: mimetype ?? null,
          small_image_size_in_kb: small_image_size_in_kb ?? null,
          large_image_size_in_kb: large_image_size_in_kb ?? null,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.track(data.trackId),
      });
      toast.success(data.message || "Track updated successfully.");
    },
    onError: (e) => {
      console.error("Failed to update track", e);
      toast.error(e.message || "Failed to update track");
    },
  });
}

export function useDeleteTrack() {
  const authToken = useAuth().authState?.token;
  const queryClient = useQueryClient();
  const client = useClient<{ message: string }>();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      await client(`${BASE_URL}/api/tracks/${id}`, authToken, {
        method: "DELETE",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks() });
      toast.success(data.message || "Track deleted successfully.");
    },
    onError: (e) => {
      console.error("Failed to delete track", e);
      toast.error(e.message || "Failed to delete track");
    },
  });
}
