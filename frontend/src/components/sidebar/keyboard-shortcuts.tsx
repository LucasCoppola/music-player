import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Play, SkipBack, SkipForward, Volume2, Search } from "lucide-react";

export default function KeyboardShortcuts({
  open,
  setOpen,
  modifierKey,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  modifierKey: "⌘" | "Ctrl";
}) {
  const shortcuts = [
    { key: "Space", action: "Play/Pause", icon: Play },
    { key: "/", action: "Search", icon: Search },
    { key: `${modifierKey} + ←`, action: "Previous", icon: SkipBack },
    { key: `${modifierKey} + →`, action: "Next", icon: SkipForward },
    { key: `${modifierKey} + ↑`, action: "Volume Up", icon: Volume2 },
    { key: `${modifierKey} + ↓`, action: "Volume Down", icon: Volume2 },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="dark text-foreground sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Press{" "}
            <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">
              {modifierKey} + /
            </kbd>{" "}
            to open this menu
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b last:border-b-0"
            >
              <div className="flex items-center">
                <shortcut.icon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{shortcut.action}</span>
              </div>
              <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
