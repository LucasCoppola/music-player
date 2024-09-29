import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@radix-ui/react-tabs";

export default function Artists() {
  return (
    <TabsContent value="artists" className="flex-1 overflow-auto p-4">
      <ScrollArea className="h-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="text-center group">
              <img
                src={`/placeholder.svg?height=150&width=150&text=Artist ${i + 1}`}
                alt={`Artist ${i + 1}`}
                className="w-32 h-32 rounded-full mx-auto mb-2 bg-zinc-800 group-hover:opacity-80 transition-opacity"
              />
              <h3 className="font-medium text-zinc-300 group-hover:text-white transition-colors">
                Artist {i + 1}
              </h3>
            </div>
          ))}
        </div>
      </ScrollArea>
    </TabsContent>
  );
}
