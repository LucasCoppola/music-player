import { cn } from "@/lib/utils";
import { UseMutationResult } from "@tanstack/react-query";
import { PencilIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface EditableInputProps {
  initialValue: string;
  field: string;
  label: string;
  trackId: string;
  updateTrack: UseMutationResult<
    {
      message: string;
      trackId: string;
    },
    Error,
    {
      id: string;
      title?: string;
      artist?: string;
      image_name?: string;
      mimetype?: string;
      size_in_kb?: number;
    },
    unknown
  >;
}

export function EditableInput({
  initialValue,
  field,
  label,
  trackId,
  updateTrack,
}: EditableInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    setValue(initialValue);
    setIsEditing(false);
  }, [initialValue, trackId]);

  async function handleSubmit() {
    if (value.trim() === "" || value === initialValue) {
      setIsEditing(false);
      return;
    }

    updateTrack.mutate({ id: trackId, [field]: value });
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setValue(initialValue);
    }
  }

  return (
    <div className="space-y-0.5 group">
      <label
        htmlFor={`${field}-input`}
        className="text-xs text-muted-foreground"
      >
        {label}
      </label>
      <div className="flex items-center justify-between w-full text-xs h-3 border-b border-transparent focus-within:border-white transition-colors">
        {isEditing ? (
          <form className="w-full">
            <input
              ref={inputRef}
              id={`${field}-input`}
              type="text"
              name={field}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSubmit}
              className={cn(
                "bg-transparent w-full focus:outline-none p-0",
                updateTrack.error && "text-red-500",
              )}
              aria-invalid={updateTrack.error ? "true" : "false"}
              aria-describedby={
                updateTrack.error ? `${field}-error` : undefined
              }
            />
          </form>
        ) : (
          <div
            className="w-full cursor-pointer truncate block"
            onClick={() => setIsEditing(true)}
            role="button"
            tabIndex={0}
            aria-label={`Edit ${label}`}
          >
            <span className={cn(value ? "" : "text-muted-foreground")}>
              {value || "-"}
            </span>
          </div>
        )}
        <div className="flex items-center">
          {!isEditing && (
            <PencilIcon className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>
    </div>
  );
}
