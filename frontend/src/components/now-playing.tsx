import { usePlayback } from "@/context/playback-context";
import { useImageFile } from "@/hooks/use-files";
import { useUpdateTrack, useUploadTrackCoverImage } from "@/hooks/use-tracks";
import { DEFAULT_COVER_TRACK_IMAGE } from "@/lib/consts";
import { cn, getUrlFromBlob } from "@/lib/utils";
import { Loader, Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { EditableInput } from "./editable-input";

export default function NowPlaying() {
  const uploadImage = useUploadTrackCoverImage();
  const updateTrack = useUpdateTrack();
  const { currentTrack } = usePlayback();
  const filename = currentTrack?.image_name
    ? `${currentTrack.image_name}-large.webp`
    : null;
  const { data: imageBlob } = useImageFile(filename);
  const imageUrl = imageBlob
    ? getUrlFromBlob(imageBlob)
    : DEFAULT_COVER_TRACK_IMAGE;

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  if (!currentTrack) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File | null;

    if (file && currentTrack) {
      if (file.size <= 5 * 1024 * 1024 && file) {
        const image = await uploadImage.mutateAsync({
          file,
        });

        if (image) {
          updateTrack.mutate({
            id: currentTrack.id,
            image_name: image?.image_name,
            mimetype: image?.mimetype,
            small_image_size_in_kb: image?.small_image_size_in_kb,
            large_image_size_in_kb: image?.large_image_size_in_kb,
          });
        }
      } else {
        toast.error("File size exceeds 5MB limit");
      }
    } else {
      toast.error("Please select a file.");
    }
  }

  return (
    <div className="hidden md:block w-56 h-[100dvh] p-4 bg-[#121212]">
      <h2 className="mb-3 text-sm font-semibold text-gray-200">Now Playing</h2>
      <div
        className="relative w-full aspect-square mb-3 group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={imageUrl}
          alt="Track cover"
          className="w-full h-full object-cover"
        />
        <form className="absolute inset-0" onSubmit={handleSubmit}>
          <label
            htmlFor="imageUpload"
            className="absolute inset-0 cursor-pointer flex items-center justify-center"
          >
            <input
              id="imageUpload"
              type="file"
              className="hidden"
              accept="image/*"
              name="file"
              onChange={(e) => e.target.form?.requestSubmit()}
            />
            <div
              className={cn(
                "group-hover:bg-black group-hover:bg-opacity-50 rounded-full p-2",
                uploadImage.isPending && "bg-opacity-50",
              )}
            >
              {uploadImage.isPending ? (
                <Loader className="w-6 h-6 text-foreground animate-spin" />
              ) : (
                isHovered && (
                  <Pencil className="w-6 h-6 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )
              )}
            </div>
          </label>
        </form>
      </div>
      <div className="space-y-2">
        <EditableInput
          initialValue={currentTrack.title}
          trackId={currentTrack.id}
          field="title"
          label="Title"
          updateTrack={updateTrack}
        />
        <EditableInput
          initialValue={currentTrack.artist}
          trackId={currentTrack.id}
          field="artist"
          label="Artist"
          updateTrack={updateTrack}
        />
        <div className="space-y-0.5 group">
          <p className="text-xs text-muted-foreground">Audio Quality</p>
          <p className="text-xs truncate">
            {getQualityLabel(currentTrack.bit_rate)} (
            {Math.floor(currentTrack.bit_rate / 1000)} kbps)
          </p>
        </div>
      </div>
    </div>
  );
}

function getQualityLabel(bit_rate: number): string {
  const bit_rate_kbps = bit_rate / 1000;

  if (bit_rate_kbps <= 64) {
    return "Low";
  } else if (bit_rate_kbps > 64 && bit_rate_kbps <= 128) {
    return "Standard";
  } else if (bit_rate_kbps > 128 && bit_rate_kbps <= 192) {
    return "Good";
  } else if (bit_rate_kbps > 192 && bit_rate_kbps <= 256) {
    return "High";
  } else if (bit_rate_kbps > 256 && bit_rate_kbps <= 320) {
    return "Very High";
  } else if (bit_rate_kbps > 320 && bit_rate_kbps <= 500) {
    return "CD Quality";
  } else if (bit_rate_kbps > 500 && bit_rate_kbps <= 1000) {
    return "Lossless";
  } else if (bit_rate_kbps > 1000 && bit_rate_kbps <= 5000) {
    return "Hi-Res Audio";
  }

  return "-";
}
