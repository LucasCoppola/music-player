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
import {
  useCreateTrack,
  useUploadTrackFile,
  // useUploadImage,
} from "@/hooks/use-tracks";
import { Input } from "@/components/ui/input";
import {
  validateTrackArtist,
  validateTrackTitle,
  // validateAlbum,
} from "@/lib/validation";
import ImageUpload from "./image-upload";
import AudioUpload from "./audio-upload";

export type TrackFormData = {
  file: File | null;
  image: File | null;
  title: string;
  artist: string;
  album: string;
};

export default function Component({
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
    album: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    artist: "",
    album: "",
  });

  const uploadTrack = useUploadTrackFile();
  // const uploadImage = useUploadImage();
  const createTrack = useCreateTrack();

  function validateForm() {
    const newErrors = {
      title: validateTrackTitle(trackFormData.title),
      artist: validateTrackArtist(trackFormData.artist),
      album: trackFormData.album,
    };
    setErrors(newErrors);
    return !newErrors.title && !newErrors.artist && !newErrors.album;
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

    // let image_url = "";
    // if (trackFormData.image) {
    //   const imageResult = await uploadImage.mutateAsync({
    //     file: trackFormData.image,
    //   });
    //   image_url = imageResult.url;
    // }

    createTrack.mutate({
      title: trackFormData.title,
      artist: trackFormData.artist,
      // album: trackFormData.album,
      track_name,
      mimetype,
      size_in_kb,
      // image_url,
    });

    setTrackFormData({
      file: null,
      image: null,
      title: "",
      artist: "",
      album: "",
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
        <DialogContent className="w-[400px] dark text-foreground">
          <DialogHeader>
            <DialogTitle>Upload Track</DialogTitle>
            <DialogDescription>
              Add a new track to your library.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid gap-4 pt-4">
              <ImageUpload
                trackFormData={trackFormData}
                setTrackFormData={setTrackFormData}
              />
              <AudioUpload
                trackFormData={trackFormData}
                setTrackFormData={setTrackFormData}
              />

              <div className="space-y-1">
                <Label htmlFor="title" className="text-sm">
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
                  className="h-8 text-xs"
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="artist" className="text-sm">
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
                  className="h-8 text-xs"
                />
                {errors.artist && (
                  <p className="text-xs text-red-500">{errors.artist}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="album" className="text-sm">
                  Album
                </Label>
                <Input
                  id="album"
                  value={trackFormData.album}
                  onChange={(e) =>
                    setTrackFormData((prevState) => ({
                      ...prevState,
                      album: e.target.value,
                    }))
                  }
                  placeholder="Enter album name"
                  className="h-8 text-xs"
                />
                {errors.album && (
                  <p className="text-xs text-red-500">{errors.album}</p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              disabled={!trackFormData.file || uploadTrack.isPending}
              className="w-full mt-2"
            >
              {uploadTrack.isPending ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                "Upload"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
