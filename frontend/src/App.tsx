import Sidebar from "./components/sidebar";
import NowPlaying from "./components/now-playing";
import PlaybackControls from "./components/playback-controls";
import Tracks from "./components/tracks";

export default function App() {
  const imageUrl =
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="dark flex flex-col h-screen text-gray-200 bg-[#0A0A0A]">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 bg-[#0A0A0A] pb-[69px] pt-2">
          <Tracks imageUrl={imageUrl} />
          <NowPlaying imageUrl={imageUrl} />
        </div>
      </div>
      <PlaybackControls imageUrl={imageUrl} />
    </div>
  );
}