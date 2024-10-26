import { Music, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import { useRef, useState } from "react";
import { TrackFormData } from "./upload-track";

export default function AudioUpload({
  trackFormData,
  setTrackFormData,
}: {
  trackFormData: TrackFormData;
  setTrackFormData: React.Dispatch<React.SetStateAction<TrackFormData>>;
}) {
  const [isFileSizeOk, setIsFileSizeOk] = useState<boolean | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setTrackFormData((prevState) => ({
        ...prevState,
        file: selectedFile,
      }));

      const limitSize = 10 * 1024 * 1024; // 10 MB
      setIsFileSizeOk(selectedFile.size <= limitSize);
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-grow"
          onClick={() => audioInputRef.current?.click()}
        >
          <Music className="mr-2 h-4 w-4" />
          {trackFormData.file ? "Change Audio" : "Select Audio"}
        </Button>
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {trackFormData.file && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              setTrackFormData((prev) => ({ ...prev, file: null }))
            }
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {trackFormData.file && (
        <div className="text-sm">
          <p className="font-medium truncate">{trackFormData.file.name}</p>
          <p className="text-xs text-muted-foreground">
            Size:{" "}
            <span
              className={
                isFileSizeOk === false ? "text-red-500" : "text-green-500"
              }
            >
              {formatFileSize(trackFormData.file.size)}
            </span>
          </p>
        </div>
      )}
      {isFileSizeOk === false && (
        <p className="text-xs text-red-500">
          Audio file size exceeds 10 MB limit.
        </p>
      )}
    </>
  );
}
