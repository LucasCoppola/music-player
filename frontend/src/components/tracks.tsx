import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis } from "lucide-react";

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

export default function Tracks({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="flex-grow">
      <Table className="w-full text-xs">
        <TableHeader className="sticky top-0 bg-[#0A0A0A] z-10 border-b border-[#282828]">
          <TableRow className="text-left text-gray-400">
            <TableHead className="py-2 pl-3 pr-2 font-medium w-10">#</TableHead>
            <TableHead className="py-2 px-2 font-medium">Title</TableHead>
            <TableHead className="py-2 px-2 font-medium">Artist</TableHead>
            <TableHead className="py-2 px-2 font-medium">Album</TableHead>
            <TableHead className="py-2 px-2 font-medium w-8">
              Duration
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="mt-[1px]">
          {tracks.map((track) => (
            <TableRow
              key={track.id}
              className="group cursor-pointer hover:bg-[#1A1A1A] select-none relative"
            >
              <TableCell className="py-[2px] pl-3 pr-2 tabular-nums w-10 text-center text-gray-400">
                {track.id}
              </TableCell>
              <TableCell className="py-[2px] px-2">
                <div className="flex items-center">
                  <div className="relative size-5 mr-2">
                    <img
                      src={imageUrl}
                      alt="Album cover"
                      className="object-cover"
                    />
                  </div>
                  <div className="font-medium truncate max-w-[180px] sm:max-w-[200px] text-[#d1d5db]">
                    {track.title}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-[2px] px-2 text-[#d1d5db] max-w-40 truncate">
                {track.artist}
              </TableCell>
              <TableCell className="py-[2px] px-2 text-[#d1d5db]">
                {track.album}
              </TableCell>
              <TableCell className="py-[2px] px-2 tabular-nums text-[#d1d5db]">
                {track.duration}
              </TableCell>
              <TableCell className="py-[2px] px-2 text-right">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm 
                          font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                          disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-5 w-5 text-gray-400 hover:text-white 
                          focus:text-white"
                    id="radix-:r2q:"
                    aria-haspopup="menu"
                    data-state="closed"
                    aria-expanded="false"
                  >
                    <Ellipsis />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
