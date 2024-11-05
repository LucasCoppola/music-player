import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import { AuthProvider } from "./providers/auth-provider.tsx";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFound } from "./components/not-found.tsx";
import { PlaybackProvider } from "./providers/playback-provider.tsx";

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
  defaultPreload: "intent",
});
const queryClient = new QueryClient();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlaybackProvider>
          <RouterProvider router={router} />
          <Toaster richColors closeButton theme="dark" position="top-right" />
        </PlaybackProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
