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
import { useUploadTrackFile } from "@/hooks/use-tracks";
import { useState } from "react";

export default function UploadTrack({
  isAuthenticated,
}: {
  isAuthenticated: boolean | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isFileSizeOk, setIsFileSizeOk] = useState<boolean | null>(null);

  const uploadTrack = useUploadTrackFile();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.size > 5 * 1024 * 1024) {
        setIsFileSizeOk(false);
      } else {
        setIsFileSizeOk(true);
      }
    }
  }

  async function handleUpload() {
    if (!file) {
      return;
    }

    uploadTrack.mutate({ file });
    setFile(null);
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
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
            Upload Song
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[450px] dark text-foreground">
          <DialogHeader>
            <DialogTitle>Upload Track</DialogTitle>
            <DialogDescription>
              Add a new track to your library.
            </DialogDescription>
          </DialogHeader>
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
            {file && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  File size:{" "}
                  <span
                    className={`${isFileSizeOk === false ? "text-red-500" : "text-green-500"}`}
                  >
                    {formatFileSize(file.size)}
                  </span>
                </p>
              </div>
            )}
          </div>
          <Button
            onClick={handleUpload}
            disabled={!file || uploadTrack.isPending}
            className="w-full"
          >
            {uploadTrack.isPending ? "Uploading..." : "Upload"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
