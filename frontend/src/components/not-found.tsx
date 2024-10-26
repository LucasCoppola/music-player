import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { NOT_FOUND_IMAGE } from "@/lib/consts";

export function NotFound() {
  return (
    <div className="flex justify-center items-center mt-16 bg-[#0A0A0A] text-white">
      <div className="text-center space-y-4">
        <img
          src={NOT_FOUND_IMAGE}
          alt="Confused Travolta GIF"
          className="mb-4"
        />
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We couldn't find what you were looking for.
        </p>
        <Link
          to="/"
          search={{ q: "" }}
          className={cn(
            buttonVariants({
              variant: "outline",
            }),
            "bg-[#1A1A1A] border-[#333]",
          )}
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
