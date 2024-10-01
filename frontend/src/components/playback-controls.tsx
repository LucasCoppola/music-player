import {
  HeartIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeIcon,
} from "lucide-react";
import { Button } from "./ui/button";

export default function PlaybackControls({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="bg-[#181818] border-t border-[#282828] flex flex-col pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center w-1/4">
          <img
            src={imageUrl}
            alt="Track thumbnail"
            className="w-10 h-10 mr-4"
          />
          <div className="flex items-center">
            <div>
              <div className="font-bold text-xs">Wanna Feel It</div>
              <div className="text-xs text-zinc-500">Infraction</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 hover:bg-zinc-900"
            >
              <HeartIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 hover:bg-zinc-900"
            >
              <SkipBackIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 hover:bg-zinc-900"
            >
              <PlayIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 hover:bg-zinc-900"
            >
              <SkipForwardIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-full flex items-center">
            <div className="text-xs text-zinc-500 mr-2">0:00</div>
            <div className="flex-grow h-1 bg-zinc-800 rounded-full">
              <div className="w-1/3 h-full bg-zinc-500 rounded-full"></div>
            </div>
            <div className="text-xs text-zinc-500 ml-2">2:05</div>
          </div>
        </div>
        <div className="flex items-center w-1/4 justify-end">
          <Button variant="ghost" size="icon" className="hover:bg-zinc-900">
            <VolumeIcon className="h-4 w-4" />
          </Button>
          <div className="w-20 h-1 bg-zinc-800 rounded-full ml-2">
            <div className="w-3/4 h-full bg-zinc-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
