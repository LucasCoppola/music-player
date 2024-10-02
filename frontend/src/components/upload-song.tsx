import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function UploadSong() {
  return (
    <div className="dark">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-[#1A1A1A] border-[#333]"
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
