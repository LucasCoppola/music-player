import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Sidebar() {
  return (
    <div className="w-56 p-4 bg-[#121212] h-[100dvh] flex flex-col">
      <Input
        className="mb-4 bg-zinc-800 border-zinc-700 focus:border-zinc-600"
        placeholder="Search"
      />
      <div className="mb-8 text-xs">All Tracks</div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">
            Playlists
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 text-xs hover:bg-zinc-800"
          >
            +
          </Button>
        </div>
      </div>
      <div className="mb-2 text-xs">YouTube</div>
      <div className="text-xs">SoundCloud</div>
    </div>
  );
}
