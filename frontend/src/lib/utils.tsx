import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BASE_URL } from "./consts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(durationInSeconds: number) {
  if (isNaN(durationInSeconds) || durationInSeconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${minutes}:${formattedSeconds}`;
}

export function highlightText(text: string, query: string | undefined) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-sky-300 text-black">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export async function getAudioBlob(filename: string | undefined) {
  if (!filename) return;

  const audioUrl = `${BASE_URL}/api/track/${filename}`;
  const authToken = localStorage.getItem("auth_token");

  const response = await fetch(audioUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch track");
  }

  return await response.blob();
}

export function getUrlFromBlob(blob: Blob | undefined) {
  if (!blob) return;
  return URL.createObjectURL(blob);
}
