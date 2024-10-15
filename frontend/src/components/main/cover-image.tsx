import { useUploadPlaylistCover } from "@/hooks/use-playlists";
import { cn } from "@/lib/utils";
import { Upload, Loader, Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function CoverImage({
  coverImage,
  playlistId,
}: {
  coverImage: string | null;
  playlistId: string;
}) {
  const { mutate: uploadPlaylistCover, isPending } = useUploadPlaylistCover();
  const imageUrl = `${import.meta.env.VITE_BASE_URL}/images/${coverImage}`;
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File | null;

    if (file) {
      if (file.size <= 5 * 1024 * 1024) {
        uploadPlaylistCover({ playlistId, image: file });
      } else {
        toast.error("File size exceeds 5MB limit");
      }
    } else {
      toast.error("Please select a file.");
    }
  }

  return coverImage ? (
    <div
      className="relative w-16 h-16 sm:w-20 sm:h-20 cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={imageUrl}
        alt="Playlist cover"
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
              <Loader className="w-4 h-4 text-foreground animate-spin" />
            ) : (
              isHovered && (
                <Pencil className="w-4 h-4 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )
            )}
          </div>
        </label>
      </form>
    </div>
  ) : (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="playlistId" value={playlistId} />
      <label
        htmlFor="coverUpload"
        className="w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center border border-neutral-700 rounded border-dashed text-white cursor-pointer"
      >
        <input
          id="coverUpload"
          type="file"
          name="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.form?.requestSubmit()}
        />
        {isPending ? (
          <Loader className="w-5 h-5 animate-spin text-neutral-600" />
        ) : (
          <>
            <Upload className="w-3 h-3 mb-1" />
            <span className="text-xs text-center">Upload</span>
          </>
        )}
      </label>
    </form>
  );
}
