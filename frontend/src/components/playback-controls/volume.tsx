import { VolumeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Volume() {
  return (
    <div className="flex items-center w-1/3 justify-end">
      <Button variant="ghost" size="icon" className="hover:bg-zinc-900">
        <VolumeIcon className="h-4 w-4" />
      </Button>
      <div className="w-20 h-1 bg-zinc-800 rounded-full ml-2">
        <div className="w-3/4 h-full bg-zinc-500 rounded-full"></div>
      </div>
    </div>
  );
}
