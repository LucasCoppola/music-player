import { Play, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlaybackButtons() {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <SkipBack className="h-4 w-4 stroke-[1.5]" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Play className="h-5 w-5 stroke-[1.5]" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <SkipForward className="h-4 w-4 stroke-[1.5]" />
      </Button>
    </div>
  );
}
