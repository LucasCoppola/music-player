import { Ellipsis } from "lucide-react";
import { Button } from "./ui/button";

const tracks = [
  {
    title: "EDM Festival Party",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:23",
  },
  {
    title: "Energising Car Game Sports",
    artist: "OddVision, Infraction",
    album: "Royalty Free",
    duration: "1:37",
  },
  {
    title: "Kick Me",
    artist: "Infraction, Alexi Action, Dedpled",
    album: "Royalty Free",
    duration: "2:18",
  },
  {
    title: "Little Ghost",
    artist: "Infraction, Emerel Gray, mini mielik",
    album: "Royalty Free",
    duration: "2:15",
  },
  {
    title: "Phonk Cyberpunk",
    artist: "Infraction & Lazerpunk",
    album: "Royalty Free",
    duration: "2:46",
  },
  {
    title: "Satellite",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "1:34",
  },
  {
    title: "Slap Phonk",
    artist: "Alexi Action & Dedpled",
    album: "Royalty Free",
    duration: "1:53",
  },
  {
    title: "Summer Love",
    artist: "Heikimer",
    album: "Royalty Free",
    duration: "2:38",
  },
  {
    title: "Sun Is Shining",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:04",
  },
  {
    title: "Time To Go",
    artist: "Balynt",
    album: "Royalty Free",
    duration: "2:18",
  },
  {
    title: "Wanna Feel It",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:05",
  },
  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    id: 16,
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },
  {
    title: "EDM Festival Party",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:23",
  },
  {
    title: "Energising Car Game Sports",
    artist: "OddVision, Infraction",
    album: "Royalty Free",
    duration: "1:37",
  },
  {
    title: "Kick Me",
    artist: "Infraction, Alexi Action, Dedpled",
    album: "Royalty Free",
    duration: "2:18",
  },
  {
    title: "Little Ghost",
    artist: "Infraction, Emerel Gray, mini mielik",
    album: "Royalty Free",
    duration: "2:15",
  },
  {
    title: "Phonk Cyberpunk",
    artist: "Infraction & Lazerpunk",
    album: "Royalty Free",
    duration: "2:46",
  },
  {
    title: "Satellite",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "1:34",
  },
  {
    title: "Slap Phonk",
    artist: "Alexi Action & Dedpled",
    album: "Royalty Free",
    duration: "1:53",
  },
  {
    title: "Summer Love",
    artist: "Heikimer",
    album: "Royalty Free",
    duration: "2:38",
  },
  {
    title: "Sun Is Shining",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:04",
  },
  {
    title: "Time To Go",
    artist: "Balynt",
    album: "Royalty Free",
    duration: "2:18",
  },
  {
    title: "Wanna Feel It",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:05",
  },
  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },
  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },
  {
    title: "EDM Festival Party",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:23",
  },
  {
    title: "Energising Car Game Sports",
    artist: "OddVision, Infraction",
    album: "Royalty Free",
    duration: "1:37",
  },
  {
    title: "Kick Me",
    artist: "Infraction, Alexi Action, Dedpled",
    album: "Royalty Free",
    duration: "2:18",
  },
  {
    title: "Little Ghost",
    artist: "Infraction, Emerel Gray, mini mielik",
    album: "Royalty Free",
    duration: "2:15",
  },
  {
    title: "Phonk Cyberpunk",
    artist: "Infraction & Lazerpunk",
    album: "Royalty Free",
    duration: "2:46",
  },
  {
    title: "Satellite",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "1:34",
  },
  {
    title: "Slap Phonk",
    artist: "Alexi Action & Dedpled",
    album: "Royalty Free",
    duration: "1:53",
  },
  {
    title: "Summer Love",
    artist: "Heikimer",
    album: "Royalty Free",
    duration: "2:38",
  },
  {
    title: "Sun Is Shining",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:04",
  },
  {
    title: "Time To Go",
    artist: "Balynt",
    album: "Royalty Free",
    duration: "2:18",
  },
  {
    title: "Wanna Feel It",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:05",
  },
  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },
  {
    title: "EDM Festival Party",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:23",
  },
  {
    title: "Energising Car Game Sports",
    artist: "OddVision, Infraction",
    album: "Royalty Free",
    duration: "1:37",
  },
  {
    title: "Kick Me",
    artist: "Infraction, Alexi Action, Dedpled",
    album: "Royalty Free",
    duration: "2:18",
  },
  {
    title: "Little Ghost",
    artist: "Infraction, Emerel Gray, mini mielik",
    album: "Royalty Free",
    duration: "2:15",
  },
  {
    title: "Phonk Cyberpunk",
    artist: "Infraction & Lazerpunk",
    album: "Royalty Free",
    duration: "2:46",
  },
  {
    title: "Satellite",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "1:34",
  },
  {
    title: "Slap Phonk",
    artist: "Alexi Action & Dedpled",
    album: "Royalty Free",
    duration: "1:53",
  },
  {
    title: "Summer Love",
    artist: "Heikimer",
    album: "Royalty Free",
    duration: "2:38",
  },
  {
    title: "Sun Is Shining",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:04",
  },
  {
    title: "Time To Go",
    artist: "Balynt",
    album: "Royalty Free",
    duration: "2:18",
  },
  {
    title: "Wanna Feel It",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:05",
  },
  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },
  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },

  {
    title: "Wanted",
    artist: "Infraction",
    album: "Royalty Free",
    duration: "2:03",
  },
];

export default function TracksTable({ imageUrl }: { imageUrl: string }) {
  return (
    <table className="w-full text-xs">
      <thead className="sticky top-0 bg-[#0A0A0A] z-10 border-b border-[#282828]">
        <tr className="text-left text-gray-400">
          <th className="py-2 pl-3 pr-2 font-medium w-10">#</th>
          <th className="py-2 px-2 font-medium">Title</th>
          <th className="py-2 px-2 font-medium hidden sm:table-cell">Artist</th>
          <th className="py-2 px-2 font-medium hidden md:table-cell">Album</th>
          <th className="py-2 px-2 font-medium">Duration</th>
          <th className="py-2 px-2 font-medium w-8"></th>
        </tr>
      </thead>
      <tbody className="mt-[1px]">
        {tracks.map((track, i) => (
          <TrackRow track={track} imageUrl={imageUrl} key={i} index={i + 1} />
        ))}
      </tbody>
    </table>
  );
}

function TrackRow({
  track,
  imageUrl,
  index,
}: {
  track: (typeof tracks)[number];
  imageUrl: string;
  index: number;
}) {
  return (
    <tr className="group cursor-pointer hover:bg-[#1A1A1A] select-none relative">
      <td className="py-[2px] pl-3 pr-2 tabular-nums w-10 text-center text-gray-400">
        {index}
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
        <div className="opacity-0 group-hover:opacity-100">
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
