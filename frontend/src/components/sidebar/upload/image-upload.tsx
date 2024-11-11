import { Edit2, X } from "lucide-react";
import { useRef, useState } from "react";
import { TrackFormData } from "./upload-track";
import { DEFAULT_COVER_TRACK_IMAGE } from "@/lib/consts";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";

export default function ImageUpload({
  trackFormData,
  setTrackFormData,
}: {
  trackFormData: TrackFormData;
  setTrackFormData: React.Dispatch<React.SetStateAction<TrackFormData>>;
}) {
  const [isImageSizeOk, setIsImageSizeOk] = useState<boolean | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setTrackFormData((prevState) => ({
        ...prevState,
        image: selectedFile,
      }));

      const limitSize = 5 * 1024 * 1024; // 5 MB
      setIsImageSizeOk(selectedFile.size <= limitSize);
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload" className="text-sm font-medium">
        Cover Image
      </Label>
      <div
        className="relative h-20 bg-[#1A1A1A] rounded-md flex items-center justify-center cursor-pointer overflow-hidden border border-border"
        onClick={() => imageInputRef.current?.click()}
      >
        {trackFormData.image ? (
          <img
            src={URL.createObjectURL(trackFormData.image)}
            alt="Album art preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={DEFAULT_COVER_TRACK_IMAGE}
            alt="Default track cover image"
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Edit2 className="text-white" />
        </div>
      </div>
      <input
        ref={imageInputRef}
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      {trackFormData.image && (
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="truncate max-w-[150px]">
              {trackFormData.image.name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() =>
                setTrackFormData((prev) => ({ ...prev, image: null }))
              }
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Size:</span>
            <span
              className={
                isImageSizeOk !== false ? "text-green-500" : "text-red-500"
              }
            >
              {formatFileSize(trackFormData.image.size)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
