import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/consts";
import { useAuth } from "@/context/auth-context";

export function useImageFile(filename: string | null) {
  const authToken = useAuth().authState?.token;
  const imageUrl = `${BASE_URL}/api/images/${filename}`;

  return useQuery({
    queryKey: ["image-file", filename],
    queryFn: async () => {
      if (!authToken || !filename) {
        throw new Error("Authentication token or filename is missing.");
      }

      const response = await fetch(imageUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch image");
      }

      return await response.blob();
    },
    enabled: !!authToken && !!filename,
  });
}
