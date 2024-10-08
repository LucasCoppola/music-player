import { HeartIcon, Play, SkipBack, SkipForward, Volume } from "lucide-react";
import { Button } from "./ui/button";

export default function PlaybackControls() {
  const imageUrl =
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  return (
    <div className="bg-[#181818] border-t border-[#282828] flex flex-col pb-[calc(0.5rem+env(safe-area-inset-bottom))] p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center w-1/3 space-x-2">
          <img
            src={imageUrl}
            alt="Track thumbnail"
            className="w-10 h-10 object-cover mr-2"
          />
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium truncate max-w-[120px] sm:max-w-[200px] text-gray-200">
                Wanna Feel It
              </div>
              <div className="text-xs text-gray-400 truncate max-w-[120px] sm:max-w-[200px]">
                Infraction
              </div>
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

        <div className="flex flex-col items-center justify-center w-1/3">
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
          <div className="w-full flex items-center mt-1">
            <span className="text-xs tabular-nums text-gray-400">0:00</span>
            <div className="flex-grow mx-2 h-1 bg-[#3E3E3E] rounded-full cursor-pointer relative">
              <div className="absolute top-0 left-0 h-full bg-white rounded-full"></div>
            </div>
            <div className="text-xs tabular-nums text-gray-400">2:05</div>
          </div>
        </div>

        <div className="flex items-center w-1/3 justify-end">
          <Button variant="ghost" size="icon" className="hover:bg-zinc-900">
            <Volume className="h-4 w-4" />
          </Button>
          <div className="w-20 h-1 bg-zinc-800 rounded-full ml-2">
            <div className="w-3/4 h-full bg-zinc-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
