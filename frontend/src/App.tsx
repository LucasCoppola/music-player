import Sidebar from "./components/sidebar/sidebar";
import NowPlaying from "./components/now-playing";
import PlaybackControls from "./components/playback-controls";
import { ScrollArea } from "./components/ui/scroll-area";
import { Outlet } from "@tanstack/react-router";

export default function App() {
  return (
    <div className="dark flex flex-col h-[100dvh] text-gray-200 bg-[#0A0A0A]">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden pt-2">
          <ScrollArea className="flex-1">
            <Outlet />
          </ScrollArea>
        </div>
        <NowPlaying />
      </div>
      <PlaybackControls />
    </div>
  );
}
