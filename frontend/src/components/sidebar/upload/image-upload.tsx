import { X, ImageIcon, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { TrackFormData } from "./upload-track";

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

  function handleRemoveImage() {
    setTrackFormData((prev) => ({ ...prev, image: null }));
    setIsImageSizeOk(null);
  }

  return (
    <>
      <div className="flex items-center space-x-4">
        <div
          className="relative w-full h-20 bg-[#1A1A1A] rounded-md flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              imageInputRef.current?.click();
            }
          }}
        >
          {trackFormData.image ? (
            <>
              <img
                src={URL.createObjectURL(trackFormData.image)}
                alt="Album art preview"
                className="w-full h-full object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                <Edit2 className="text-white" />
              </div>
            </>
          ) : (
            <ImageIcon className="h-10 w-10 text-foreground" />
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {trackFormData.image && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-black bg-opacity-50 hover:bg-opacity-70"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        )}
      </div>
      {isImageSizeOk === false && (
        <p className="text-xs text-red-500">Image size exceeds 5 MB limit.</p>
      )}
    </>
  );
}
