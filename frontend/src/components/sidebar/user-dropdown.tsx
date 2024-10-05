import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { AuthState } from "@/context/auth-context";

export default function UserDropdown({
  authState,
  logout,
}: {
  authState: AuthState;
  logout: () => void;
}) {
  const { username, email, imageUrl } = authState;

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
        <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
