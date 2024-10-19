import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useDebounce } from "use-debounce";

export default function SearchInput() {
  const [value, setValue] = useState("");
  const [debouncedQuery] = useDebounce(value, 300);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debouncedQuery) {
      navigate({ to: `/?q=${encodeURIComponent(debouncedQuery)}` });
    }
  }, [navigate, debouncedQuery]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="search"
        className="bg-[#1A1A1A] border-[#333] text-xs h-8 focus-visible:ring-1 pr-8 [&::-webkit-search-cancel-button]:appearance-none"
        placeholder="Search"
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
          onClick={() => {
            setValue("");
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      ) : (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center bg-neutral-800 rounded text-neutral-400 border border-neutral-700">
          <span className="font-mono text-xs">/</span>
        </div>
      )}
    </div>
  );
}
