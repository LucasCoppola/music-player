import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Ellipsis,
  HeartIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeIcon,
} from "lucide-react";

export default function App() {
  return (
    <div className="dark flex flex-col h-screen text-gray-200 bg-[#0A0A0A]">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 p-4 bg-zinc-900 flex flex-col">
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

        {/* Main content */}
        <div className="flex flex-1 bg-[#0A0A0A] pb-[69px] pt-2">
          <div className="flex-grow">
            <Table className="w-full text-xs">
              <TableHeader className="sticky top-0 bg-[#0A0A0A] z-10 border-b border-[#282828]">
                <TableRow className="text-left text-gray-400">
                  <TableHead className="py-2 pl-3 pr-2 font-medium w-10">
                    #
                  </TableHead>
                  <TableHead className="py-2 px-2 font-medium">Title</TableHead>
                  <TableHead className="py-2 px-2 font-medium">
                    Artist
                  </TableHead>
                  <TableHead className="py-2 px-2 font-medium">Album</TableHead>
                  <TableHead className="py-2 px-2 font-medium w-8">
                    Duration
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="mt-[1px]">
                {[
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
                ].map((track) => (
                  <TableRow
                    key={track.id}
                    className="group cursor-pointer hover:bg-[#1A1A1A] select-none relative"
                  >
                    <TableCell className="py-[2px] pl-3 pr-2 tabular-nums w-10 text-center text-gray-400">
                      {track.id}
                    </TableCell>
                    <TableCell className="py-[2px] px-2 font-medium truncate max-w-[180px] sm:max-w-[200px] text-[#d1d5db]">
                      {track.title}
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

          {/* Now Playing */}
          <div className="w-56 p-3 border-l border-zinc-800 bg-zinc-950 flex-shrink-0">
            <h2 className="mb-3 text-sm font-semibold text-gray-200">
              Now Playing
            </h2>
            <img
              src="/placeholder.svg?height=200&width=200"
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
        </div>
      </div>

      {/* Playback controls */}
      <div className="h-20 border-t border-zinc-800 flex flex-col bg-zinc-950">
        <div className="flex items-center justify-between px-4 h-20">
          <div className="flex items-center w-1/4">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="Track thumbnail"
              className="w-10 h-10 mr-4"
            />
            <div className="flex items-center">
              <div>
                <div className="font-bold text-xs">Wanna Feel It</div>
                <div className="text-xs text-zinc-500">Infraction</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 hover:bg-zinc-900"
              >
                <HeartIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-1/2">
            <div className="flex items-center mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 hover:bg-zinc-900"
              >
                <SkipBackIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 hover:bg-zinc-900"
              >
                <PlayIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 hover:bg-zinc-900"
              >
                <SkipForwardIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-full flex items-center">
              <div className="text-xs text-zinc-500 mr-2">0:00</div>
              <div className="flex-grow h-1 bg-zinc-800 rounded-full">
                <div className="w-1/3 h-full bg-zinc-500 rounded-full"></div>
              </div>
              <div className="text-xs text-zinc-500 ml-2">2:05</div>
            </div>
          </div>
          <div className="flex items-center w-1/4 justify-end">
            <Button variant="ghost" size="icon" className="hover:bg-zinc-900">
              <VolumeIcon className="h-4 w-4" />
            </Button>
            <div className="w-20 h-1 bg-zinc-800 rounded-full ml-2">
              <div className="w-3/4 h-full bg-zinc-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
