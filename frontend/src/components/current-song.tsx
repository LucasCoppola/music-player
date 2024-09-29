import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function CurrentSong() {
  return (
    <div className="flex items-center flex-1">
      <img
        src="/placeholder.svg?height=48&width=48&text=Album"
        alt="Album cover"
        className="w-12 h-12 rounded mr-4 bg-zinc-800"
      />
      <div>
        <h4 className="font-medium text-white">Current Song Title</h4>
        <p className="text-sm text-zinc-400">Artist Name</p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="ml-4 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        <Heart className="h-4 w-4" />
      </Button>
    </div>
  );
}
