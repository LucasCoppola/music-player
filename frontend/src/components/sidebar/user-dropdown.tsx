import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { AuthState } from "@/context/auth-context";
import KeyboardShortcuts from "./keyboard-shortcuts";
import { useEffect, useState } from "react";

function getModifierKey() {
  return navigator.userAgent.includes("Mac") ? "⌘" : "Ctrl";
}

export default function UserDropdown({
  authState,
  logout,
}: {
  authState: AuthState;
  logout: () => void;
}) {
  const { username, email, imageUrl } = authState;
  const [open, setOpen] = useState(false);
  const modifierKey = getModifierKey();

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [open]);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              "flex items-center justify-start px-0 cursor-pointer",
            )}
          >
            <img
              src={
                imageUrl ??
                `https://api.dicebear.com/7.x/notionists/png?seed=${username}`
              }
              alt="Avatar"
              className="size-7 rounded-full border mr-2"
            />
            <span className="text-[#d1d5db] text-sm font-medium truncate">
              {username}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="dark bg-[#1A1A1A] border-[#333] w-48"
          align="start"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{username}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs" onSelect={() => setOpen(true)}>
            Keyboard shortcuts
            <DropdownMenuShortcut>
              <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">{modifierKey}</span>/
              </kbd>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs" onClick={() => logout()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <KeyboardShortcuts
        open={open}
        setOpen={setOpen}
        modifierKey={modifierKey}
      />
    </>
  );
}
