export default function NowPlaying({ imageUrl }: { imageUrl: string }) {
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
