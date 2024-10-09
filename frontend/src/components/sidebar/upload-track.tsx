import { Music, Upload, X } from "lucide-react";
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
import { useState } from "react";
import { Input } from "../ui/input";
import { validateTrackArtist, validateTrackTitle } from "@/lib/validation";

type TrackFormData = {
  file: File | null;
  title: string;
  artist: string;
};

export default function UploadTrack({
  isAuthenticated,
}: {
  isAuthenticated: boolean | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [trackFormData, setTrackFormData] = useState<TrackFormData>({
    file: null,
    title: "",
    artist: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    artist: "",
  });
  const [isFileSizeOk, setIsFileSizeOk] = useState<boolean | null>(null);

  const uploadTrack = useUploadTrackFile();
  const createTrack = useCreateTrack();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setTrackFormData((prevState) => ({
        ...prevState,
        file: selectedFile,
      }));

      const limitSize = 5 * 1024 * 1024; // 5 MB
      setIsFileSizeOk(selectedFile.size <= limitSize);
    }
  }

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

    const { track_file_path, mimetype, size_in_kb } =
      await uploadTrack.mutateAsync({
        file: trackFormData.file,
      });

    createTrack.mutate({
      title: trackFormData.title,
      artist: trackFormData.artist,
      track_file_path,
      mimetype,
      size_in_kb,
    });

    setTrackFormData({
      file: null,
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
        <DialogContent className="w-[450px] dark text-foreground">
          <DialogHeader>
            <DialogTitle>Upload Track</DialogTitle>
            <DialogDescription>
              Add a new track to your library.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid gap-4 pt-4">
              <div className="flex items-center justify-center">
                <Label htmlFor="audio-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                      <Music />
                    </div>
                    <span className="mt-2 text-sm text-muted-foreground">
                      Select an audio file
                    </span>
                    <span className="mt-1 text-sm text-muted-foreground">
                      Max. 5 MB
                    </span>
                  </div>
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </Label>
              </div>
              {trackFormData.file && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {trackFormData.file.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        setTrackFormData((prevState) => ({
                          ...prevState,
                          file: null,
                        }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    File size:{" "}
                    <span
                      className={`${isFileSizeOk === false ? "text-red-500" : "text-green-500"}`}
                    >
                      {formatFileSize(trackFormData.file.size)}
                    </span>
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
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
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist</Label>
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
                />
                {errors.artist && (
                  <p className="text-xs text-red-500">{errors.artist}</p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              disabled={!trackFormData.file || uploadTrack.isPending}
              className="w-full mt-2"
            >
              {uploadTrack.isPending ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
}
