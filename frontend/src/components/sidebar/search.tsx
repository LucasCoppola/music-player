import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function SearchInput() {
  const [value, setValue] = useState("");

  return (
    <div className="relative">
      <Input
        type="search"
        className="bg-[#1A1A1A] border-[#333] text-xs h-8 focus-visible:ring-1 pr-8 [&::-webkit-search-cancel-button]:appearance-none"
        style={{
          WebkitAppearance: "none",
          MozAppearance: "none",
          appearance: "none",
        }}
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
          onClick={() => setValue("")}
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
