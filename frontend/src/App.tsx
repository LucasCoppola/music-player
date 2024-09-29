import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "./components/sidebar";
import VolumeSlider from "./components/volume-slider";
import MusicPlayer from "./components/music-player";
import CurrentSong from "./components/current-song";
import Artists from "./components/artists";
import Songs from "./components/songs";

export default function App() {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden bg-black">
          <Tabs defaultValue="songs" className="h-full flex flex-col">
            <div className="px-4 py-2 border-b border-zinc-800">
              <TabsList className="bg-zinc-950">
                <TabsTrigger
                  value="songs"
                  className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-800 hover:text-white transition-colors"
                >
                  Songs
                </TabsTrigger>
                <TabsTrigger
                  value="artists"
                  className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-800 hover:text-white transition-colors"
                >
                  Artists
                </TabsTrigger>
              </TabsList>
            </div>
            <Artists />
            <Songs />
          </Tabs>
        </main>
      </div>
      <footer className="h-20 bg-zinc-950 border-t border-zinc-800 flex items-center px-4">
        <CurrentSong />
        <MusicPlayer />
        <VolumeSlider />
      </footer>
    </div>
  );
}
