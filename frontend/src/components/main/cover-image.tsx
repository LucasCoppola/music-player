import { Upload, Loader2 } from "lucide-react";

export function CoverImage({
  url,
  playlistId,
}: {
  url: string | null;
  playlistId: string;
}) {
  const currentUrl = url;
  const pending = false;

  if (currentUrl) {
    return (
      <img
        src={currentUrl}
        alt="Playlist cover"
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
      />
    );
  }

  return (
    <form>
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
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size <= 5 * 1024 * 1024) {
                e.target.form?.requestSubmit();
              } else {
                alert("File size exceeds 5MB limit");
                e.target.value = "";
              }
            }
          }}
        />
        {pending ? (
          <Loader2 className="w-5 h-5 animate-spin text-neutral-600" />
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
