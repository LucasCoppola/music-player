import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { Button } from "./ui/button";

export function PlaylistLoadingSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A] pb-[69px]">
      <div className="flex items-center justify-between p-3 bg-[#0A0A0A]">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <div className="h-4 w-24 bg-primary/10 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-7 w-16 bg-primary/10 rounded animate-pulse"></div>
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center py-3 px-4 space-x-3 bg-[#0A0A0A]">
        <div className="w-20 h-20 bg-primary/10 rounded animate-pulse"></div>
        <div>
          <div className="h-6 w-40 bg-primary/10 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-24 bg-primary/10 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="min-w-max">
        <TracksTableSkeleton />
      </div>
    </div>
  );
}

export function TracksTableSkeleton() {
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
        {[...Array(10)].map((_, i) => (
          <tr key={i} className="group hover:bg-[#1A1A1A] select-none relative">
            <td className="py-[3px] pl-3 pr-2 w-10 text-center">
              <div className="h-4 w-4 bg-primary/10 rounded animate-pulse"></div>
            </td>
            <td className="py-[2px] px-2">
              <div className="flex items-center">
                <div className="h-4 w-32 bg-primary/10 rounded animate-pulse"></div>
              </div>
            </td>
            <td className="py-[2px] px-2 hidden sm:table-cell">
              <div className="h-4 w-24 bg-primary/10 rounded animate-pulse"></div>
            </td>
            <td className="py-[2px] px-2 hidden md:table-cell">
              <div className="h-4 w-24 bg-primary/10 rounded animate-pulse"></div>
            </td>
            <td className="py-[2px] px-2">
              <div className="h-4 w-12 bg-primary/10 rounded animate-pulse"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
