export default function NowPlaying() {
  const imageUrl =
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  return (
    <div className="w-56 h-[100dvh] p-4 bg-[#121212]">
      <h2 className="mb-3 text-sm font-semibold text-gray-200">Now Playing</h2>
      <img
        src={imageUrl}
        alt="Album cover"
        className="w-full aspect-square object-cover mb-3"
      />
      <div className="space-y-1 text-xs">
        <div>
          <p className="text-gray-400">Title</p>
          <p className="text-gray-200 truncate">Wanna Feel It</p>
        </div>
        <div>
          <p className="text-gray-400">Artist</p>
          <p className="text-gray-200 truncate">Infraction</p>
        </div>
        <div>
          <p className="text-gray-400">Album</p>
          <p className="text-gray-200 truncate">Royalty Free</p>
        </div>
        <div>
          <p className="text-gray-400">Genre</p>
          <p className="text-gray-200 truncate">Electronic</p>
        </div>
        <div>
          <p className="text-gray-400">BPM</p>
          <p className="text-gray-200 truncate"></p>
        </div>
        <div>
          <p className="text-gray-400">Key</p>
          <p className="text-gray-200 truncate"></p>
        </div>
      </div>
    </div>
  );
}
