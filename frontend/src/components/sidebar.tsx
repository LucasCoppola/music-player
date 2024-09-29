import { Library, ListMusic, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 overflow-hidden flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white">Music App</h2>
      </div>
      <nav className="flex-1">
        <ul className="px-2 py-4">
          <li className="mb-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ListMusic className="mr-2 h-4 w-4" />
              Playlists
            </Button>
          </li>
          <li className="mb-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Mic2 className="mr-2 h-4 w-4" />
              Artists
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Library className="mr-2 h-4 w-4" />
              Albums
            </Button>
          </li>
        </ul>
      </nav>

      <div className="p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-500">Playlists</h3>
        <ul className="space-y-2">
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Favorites
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Recently Played
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Top Hits 2023
            </Button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
