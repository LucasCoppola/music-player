import { Ellipsis } from "lucide-react";
import { Button } from "./ui/button";

const tracks = [
  {
    id: 1,
    title: "EDM Festival Party",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:23",
  },
  {
    id: 2,
    title: "Energising Car Game Sports",
    artist: "OddVision, Infraction",
    album: "Royalty Free",
    duration: "1:37",
  },
  {
    id: 3,
    title: "Kick Me",
    artist: "Infraction, Alexi Action, Dedpled",
    album: "Royalty Free",
    duration: "2:18",
  },
  {
    id: 4,
    title: "Little Ghost",
    artist: "Infraction, Emerel Gray, mini mielik",
    album: "Royalty Free",
    duration: "2:15",
  },
  {
    id: 5,
    title: "Phonk Cyberpunk",
    artist: "Infraction & Lazerpunk",
    album: "Royalty Free",
    duration: "2:46",
  },
  {
    id: 6,
    title: "Satellite",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "1:34",
  },
  {
    id: 7,
    title: "Slap Phonk",
    artist: "Alexi Action & Dedpled",
    album: "Royalty Free",
    duration: "1:53",
  },
  {
    id: 8,
    title: "Summer Love",
    artist: "Heikimer",
    album: "Royalty Free",
    duration: "2:38",
  },
  {
    id: 9,
    title: "Sun Is Shining",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:04",
  },
  {
    id: 10,
    title: "Time To Go",
    artist: "Balynt",
    album: "Royalty Free",
    duration: "2:18",
  },
  {
    id: 11,
    title: "Wanna Feel It",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:05",
  },
];

export default function TracksTable({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="flex flex-1 bg-[#0A0A0A] pb-[69px] pt-2">
      <div className="flex-1">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-[#0A0A0A] z-10 border-b border-[#282828]">
            <tr className="text-left text-gray-400">
              <th className="py-2 pl-3 pr-2 font-medium w-10">#</th>
              <th className="py-2 px-2 font-medium">Title</th>
              <th className="py-2 px-2 font-medium hidden sm:table-cell">
                Artist
              </th>
              <th className="py-2 px-2 font-medium hidden md:table-cell">
                Album
              </th>
              <th className="py-2 px-2 font-medium">Duration</th>
              <th className="py-2 px-2 font-medium w-8"></th>
            </tr>
          </thead>
          <tbody className="mt-[1px]">
            {tracks.map((track) => (
              <TrackRow track={track} imageUrl={imageUrl} key={track.id} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrackRow({
  track,
  imageUrl,
}: {
  track: (typeof tracks)[number];
  imageUrl: string;
}) {
  return (
    <tr className="group cursor-pointer hover:bg-[#1A1A1A] select-none relative">
      <td className="py-[2px] pl-3 pr-2 tabular-nums w-10 text-center text-gray-400">
        {track.id}
      </td>
      <td className="py-[2px] px-2">
        <div className="flex items-center">
          <div className="relative size-5 mr-2">
            <img src={imageUrl} alt="Album cover" className="object-cover" />
          </div>
          <div className="font-medium truncate max-w-[180px] sm:max-w-[200px] text-[#d1d5db]">
            {track.title}
          </div>
        </div>
      </td>
      <td className="py-[2px] px-2 text-[#d1d5db] max-w-40 truncate">
        {track.artist}
      </td>
      <td className="py-[2px] px-2 text-[#d1d5db]">{track.album}</td>
      <td className="py-[2px] px-2 tabular-nums text-[#d1d5db]">
        {track.duration}
      </td>
      <td className="py-[2px] px-2 text-right">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-gray-400 hover:text-white focus:text-white"
          >
            <Ellipsis className="size-4" />
            <span className="sr-only">Track options</span>
          </Button>
        </div>
      </td>
    </tr>
  );
}
