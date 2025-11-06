import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Play from "./pages/Play.jsx";
import "./index.css";
import { Toaster, toast } from "sonner";
import "./index.css";
import Level1 from "./pages/levels/Level1.jsx";
import Level2 from "./pages/levels/Level2.jsx";
import Level3 from "./pages/levels/Level3.jsx";
import Level4 from "./pages/levels/Level4.jsx";

const queryClient = new QueryClient();

const DevToolsBlocker = () => {
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();

    const handleKeyDown = (e) => {
      if (e.key === "F12") e.preventDefault();
      if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) {
        e.preventDefault();
      }
      if (e.ctrlKey && e.key.toUpperCase() === "U") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
};

const DevToolsGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let devtoolsOpen = false;

    const checkDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          toast.warning("⚠️ Developer Tools detected! Closing for security reasons...");
          setTimeout(() => {
            navigate("/");  
            window.location.reload(); 
          }, 1000);
        }
      } else {
        devtoolsOpen = false;
      }
    };

    const interval = setInterval(checkDevTools, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <DevToolsBlocker />
      <DevToolsGuard />
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/level1" element={<Level1 />} />
        <Route path="/level2" element={<Level2 />} />
        <Route path="/level3" element={<Level3 />} />
        <Route path="/level4" element={<Level4 />} />
        <Route path="/play" element={<Play />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
