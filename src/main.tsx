import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { hydrateAuth } from "@/store/auth.store";

// hydrate auth state from session/local storage before rendering
hydrateAuth();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster richColors position="top-right" />
    <App />
  </StrictMode>
);
