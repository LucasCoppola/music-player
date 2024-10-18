import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useUpdatePlaylistTitle } from "@/hooks/use-playlists";

export function EditableTitle({
  playlistId,
  initialName,
}: {
  playlistId: string;
  initialName: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useUpdatePlaylistTitle();

  useEffect(() => {
    setName(initialName);
  }, [initialName, playlistId]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsEditing(false);
    if (name === "Favorites") {
      setName(initialName);
    } else if (name.trim() !== "" && name !== initialName) {
      mutate({ id: playlistId, title: name });
    } else {
      setName(initialName); // Reset to initial name if empty or unchanged
    }
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setIsEditing(false)}
          className="text-xl sm:text-2xl font-bold bg-transparent border-none focus:ring-0"
        />
      </form>
    );
  }

  return (
    <h1
      className="text-xl sm:text-2xl font-bold cursor-pointer"
      onClick={() => setIsEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          setIsEditing(true);
        }
      }}
      tabIndex={0}
    >
      {name}
    </h1>
  );
}
