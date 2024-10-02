import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { buttonVariants } from "./ui/button";

export default function UserDropdown() {
  const username = "shadcn";
  const email = "nCqQ8@example.com";
  const imageUrl = "https://github.com/shadcn.png";

  return (
    <DropdownMenu>
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
            src={imageUrl}
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
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
