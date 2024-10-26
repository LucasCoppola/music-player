import { usePlayback } from "@/context/playback-context";
import { useImageFile } from "@/hooks/use-files";
import { useUploadTrackCoverImage } from "@/hooks/use-tracks";
import { DEFAULT_COVER_TRACK_IMAGE } from "@/lib/consts";
import { cn, getUrlFromBlob } from "@/lib/utils";
import { Loader, Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function NowPlaying() {
  const { mutate: uploadTrackCoverImage, isPending } =
    useUploadTrackCoverImage();
  const { currentTrack } = usePlayback();
  const { data: imageBlob } = useImageFile(currentTrack?.image_name ?? "");
  const imageUrl = imageBlob
    ? getUrlFromBlob(imageBlob)
    : DEFAULT_COVER_TRACK_IMAGE;

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  if (!currentTrack) {
    return null;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File | null;

    if (file && currentTrack) {
      if (file.size <= 5 * 1024 * 1024) {
        uploadTrackCoverImage({ trackId: currentTrack.id, file });
      } else {
        toast.error("File size exceeds 5MB limit");
      }
    } else {
      toast.error("Please select a file.");
    }
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
          alt="Album cover"
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
                isPending && "bg-opacity-50",
              )}
            >
              {isPending ? (
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
      <div className="text-xs space-y-2">
        <div className="space-y-0.5 group">
          <p className="text-xs text-muted-foreground">Title</p>
          <p className="text-xs truncate ">{currentTrack.title}</p>
        </div>
        <div className="space-y-0.5 group">
          <p className="text-xs text-muted-foreground">Artist</p>
          <p className="text-xs truncate ">{currentTrack.artist}</p>
        </div>
        <div className="space-y-0.5 group">
          <p className="text-xs text-muted-foreground">Audio Quality</p>
          <p className="text-xs truncate ">
            {getQualityLabel(currentTrack.bit_rate)} (
            {Math.floor(currentTrack.bit_rate / 1000)} kbps)
          </p>
        </div>
      </div>
    </div>
  );
}
