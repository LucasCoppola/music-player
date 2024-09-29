import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Library,
  ListMusic,
  Mic2,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume,
} from "lucide-react";

export default function App() {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
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
            <h3 className="mb-2 text-sm font-medium text-zinc-500">
              Playlists
            </h3>
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
        <main className="flex-1 overflow-hidden bg-black">
          <Tabs defaultValue="artists" className="h-full flex flex-col">
            <div className="px-4 py-2 border-b border-zinc-800">
              <TabsList className="bg-zinc-950">
                <TabsTrigger
                  value="artists"
                  className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-800 hover:text-white transition-colors"
                >
                  Artists
                </TabsTrigger>
                <TabsTrigger
                  value="songs"
                  className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-800 hover:text-white transition-colors"
                >
                  Songs
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="artists" className="flex-1 overflow-auto p-4">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="text-center group">
                      <img
                        src={`/placeholder.svg?height=150&width=150&text=Artist ${i + 1}`}
                        alt={`Artist ${i + 1}`}
                        className="w-32 h-32 rounded-full mx-auto mb-2 bg-zinc-800 group-hover:opacity-80 transition-opacity"
                      />
                      <h3 className="font-medium text-zinc-300 group-hover:text-white transition-colors">
                        Artist {i + 1}
                      </h3>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="songs" className="flex-1 overflow-auto p-4">
              <ScrollArea className="h-full">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-2 text-zinc-500">#</th>
                      <th className="text-left py-2 text-zinc-500">Title</th>
                      <th className="text-left py-2 text-zinc-500">Artist</th>
                      <th className="text-left py-2 text-zinc-500">Album</th>
                      <th className="text-left py-2 text-zinc-500">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(20)].map((_, i) => (
                      <tr
                        key={i}
                        className="border-b border-zinc-900 last:border-b-0 hover:bg-zinc-900 transition-colors"
                      >
                        <td className="py-2 text-zinc-600">{i + 1}</td>
                        <td className="py-2 text-white">Song Title {i + 1}</td>
                        <td className="py-2 text-zinc-400">Artist Name</td>
                        <td className="py-2 text-zinc-400">Album Name</td>
                        <td className="py-2 text-zinc-600">3:30</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <footer className="h-20 bg-zinc-950 border-t border-zinc-800 flex items-center px-4">
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
        <div className="flex items-center justify-end flex-1">
          <Button
            size="icon"
            variant="ghost"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Volume className="h-4 w-4" />
          </Button>
          <Slider
            defaultValue={[66]}
            max={100}
            step={1}
            className="w-28 ml-2"
          />
        </div>
      </footer>
    </div>
  );
}
