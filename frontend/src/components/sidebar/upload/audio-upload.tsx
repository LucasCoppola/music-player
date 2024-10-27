import { Music, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import { useRef, useState } from "react";
import { TrackFormData } from "./upload-track";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-2">
      <Label htmlFor="audio-upload" className="text-sm font-medium">
        Audio File
      </Label>
      <div className="flex flex-col">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full mb-2 h-20 group relative overflow-hidden transition-colors hover:bg-muted/50 focus-visible:bg-muted/50"
          onClick={() => audioInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-1.5 relative z-10">
            <Music className="size-6 text-primary transition-transform group-hover:scale-110 group-focus-visible:scale-110" />
            <span className="text-xs font-medium">
              {trackFormData.file ? "Change Audio" : "Select Audio"}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-background/0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
        </Button>
        <input
          ref={audioInputRef}
          id="audio-upload"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {trackFormData.file && (
          <div className="text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="truncate max-w-[150px]">
                {trackFormData.file.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() =>
                  setTrackFormData((prev) => ({
                    ...prev,
                    file: null,
                  }))
                }
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove audio</span>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Size:</span>
              <span
                className={isFileSizeOk ? "text-green-500" : "text-red-500"}
              >
                {formatFileSize(trackFormData.file.size)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
