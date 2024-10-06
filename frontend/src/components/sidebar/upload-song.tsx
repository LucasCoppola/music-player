import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function UploadSong({
  isAuthenticated,
}: {
  isAuthenticated: boolean | undefined;
}) {
  function handleUpload(e: React.MouseEvent) {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.info("Please login to upload songs.");
    }
  }

  return (
    <div className="dark">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`w-full justify-start bg-[#1A1A1A] border-[#333] ${!isAuthenticated && "opacity-50 cursor-not-allowed"}`}
            onClick={handleUpload}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Song
          </Button>
        </DialogTrigger>
        <DialogContent className="dark text-foreground">
          <DialogHeader>
            <DialogTitle>Upload a new song</DialogTitle>
            <DialogDescription>
              Choose a file to upload to your library.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="song">Song file</Label>
              <Input id="song" type="file" className="col-span-3" />
            </div>
          </div>
          <Button type="submit">Upload</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
