import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@radix-ui/react-tabs";

export default function Songs() {
  return (
    <TabsContent value="songs" className="flex-1 overflow-auto p-4">
      <ScrollArea className="h-full">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 text-zinc-500">#</th>
              <th className="text-left py-2 text-zinc-500">Title</th>
              <th className="text-left py-2 text-zinc-500">Artist</th>
              <th className="text-left py-2 text-zinc-500">Album</th>
              <th className="text-left py-2 text-zinc-500">Duration</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(20)].map((_, i) => (
              <tr
                key={i}
                className="border-b border-zinc-900 last:border-b-0 hover:bg-zinc-900 transition-colors"
              >
                <td className="py-2 text-zinc-600">{i + 1}</td>
                <td className="py-2 text-white">Song Title {i + 1}</td>
                <td className="py-2 text-zinc-400">Artist Name</td>
                <td className="py-2 text-zinc-400">Album Name</td>
                <td className="py-2 text-zinc-600">3:30</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </TabsContent>
  );
}
