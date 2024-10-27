import React, { useState } from "react";
import { Loader, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateTrack, useUploadTrackFile } from "@/hooks/use-tracks";
import { Input } from "@/components/ui/input";
import { validateTrackArtist, validateTrackTitle } from "@/lib/validation";
import ImageUpload from "./image-upload";
import AudioUpload from "./audio-upload";

export type TrackFormData = {
  file: File | null;
  image: File | null;
  title: string;
  artist: string;
};

export default function UploadTrack({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [trackFormData, setTrackFormData] = useState<TrackFormData>({
    file: null,
    image: null,
    title: "",
    artist: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    artist: "",
  });

  const uploadTrack = useUploadTrackFile();
  const createTrack = useCreateTrack();

  function validateForm() {
    const newErrors = {
      title: validateTrackTitle(trackFormData.title),
      artist: validateTrackArtist(trackFormData.artist),
    };
    setErrors(newErrors);
    return !newErrors.title && !newErrors.artist;
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (!trackFormData.file) {
      return;
    }

    const { track_name, mimetype, size_in_kb } = await uploadTrack.mutateAsync({
      file: trackFormData.file,
    });

    createTrack.mutate({
      title: trackFormData.title,
      artist: trackFormData.artist,
      track_name,
      mimetype,
      size_in_kb,
    });

    setTrackFormData({
      file: null,
      image: null,
      title: "",
      artist: "",
    });
    setOpen(false);
  }

  return (
    <div className="dark">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`w-full justify-start bg-[#1A1A1A] border-[#333] ${!isAuthenticated && "opacity-50 cursor-not-allowed"}`}
            onClick={(e: React.MouseEvent) => {
              if (!isAuthenticated) {
                e.preventDefault();
                toast.info("Please login to upload track.");
              }
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Track
          </Button>
        </DialogTrigger>
        <DialogContent className="dark text-foreground sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Track</DialogTitle>
            <DialogDescription>
              Add a new track to your library.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload
                trackFormData={trackFormData}
                setTrackFormData={setTrackFormData}
              />
              <AudioUpload
                trackFormData={trackFormData}
                setTrackFormData={setTrackFormData}
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={trackFormData.title}
                  onChange={(e) =>
                    setTrackFormData((prevState) => ({
                      ...prevState,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter track title"
                  className="h-9"
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist" className="text-sm font-medium">
                  Artist
                </Label>
                <Input
                  id="artist"
                  value={trackFormData.artist}
                  onChange={(e) =>
                    setTrackFormData((prevState) => ({
                      ...prevState,
                      artist: e.target.value,
                    }))
                  }
                  placeholder="Enter artist name"
                  className="h-9"
                />
                {errors.artist && (
                  <p className="text-xs text-red-500">{errors.artist}</p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              disabled={!trackFormData.file || uploadTrack.isPending}
              className="w-full"
            >
              {uploadTrack.isPending ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {uploadTrack.isPending ? "Uploading..." : "Upload Track"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
