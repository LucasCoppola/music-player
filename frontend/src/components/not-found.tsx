import { cn } from "@/lib/utils";
import { Link } from "lucide-react";
import { buttonVariants } from "./ui/button";

export function NotFound() {
  return (
    <div className="flex justify-center items-center mt-16 bg-[#0A0A0A] text-white">
      <div className="text-center space-y-4">
        <img
          src="https://res.cloudinary.com/dotpfjpno/image/upload/v1716302397/confused-travolta_bmqc1k.gif"
          alt="Confused Travolta GIF"
          className="mb-4"
        />
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We couldn't find what you were looking for.
        </p>
        <Link
          to="/"
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
