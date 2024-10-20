import { usePlayback } from "@/context/playback-context";
import { useUploadTrackCoverImage } from "@/hooks/use-tracks";
import { cn, getCoverTrackImage } from "@/lib/utils";
import { Loader, Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function NowPlaying() {
  const { mutate: uploadTrackCoverImage, isPending } =
    useUploadTrackCoverImage();
  const { currentTrack } = usePlayback();
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

  return (
    <div className="hidden md:block w-56 h-[100dvh] p-4 bg-[#121212]">
      <h2 className="mb-3 text-sm font-semibold text-gray-200">Now Playing</h2>
      <div
        className="relative w-full aspect-square mb-3 group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={getCoverTrackImage(currentTrack.image_name)}
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
          <p className="text-xs text-muted-foreground">Bit Rate</p>
          <p className="text-xs truncate ">
            {currentTrack.bit_rate
              ? `${Math.round(currentTrack.bit_rate / 1000)} kbps`
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
