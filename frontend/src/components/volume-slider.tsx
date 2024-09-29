import { Volume } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

export default function VolumeSlider() {
  return (
    <div className="flex items-center justify-end flex-1">
      <Button
        size="icon"
        variant="ghost"
        className="text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        <Volume className="h-4 w-4" />
      </Button>
      <Slider defaultValue={[66]} max={100} step={1} className="w-28 ml-2" />
    </div>
  );
}
