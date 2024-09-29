import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react";

export default function MusicPlayer() {
  return (
    <div className="flex flex-col items-center flex-1">
      <div className="flex items-center mb-2">
        <Button
          size="icon"
          variant="ghost"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="mx-2 bg-white text-black hover:bg-zinc-200 transition-colors"
        >
          <Play className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Repeat className="h-4 w-4" />
        </Button>
      </div>
      <Slider defaultValue={[33]} max={100} step={1} className="w-[60%]" />
    </div>
  );
}
