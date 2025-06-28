import { useState } from "react";
import TopBar from "./components/TopBar";
import Dock from "./components/Dock";
import AppWindow from "./components/AppWindow";
import FinderApp from "./components/FinderApp";
import Desktop from "./components/Desktop";
import NotesApp from "./components/NotesApp";
import TerminalApp from "./components/TerminalApp";
import WallpaperPicker from "./components/WallpaperPicker";
import ShutdownScreen from "./components/ShutdownScreen";

function App() {
  const [windows, setWindows] = useState([
    { key: "finder", open: true, zIndex: 1 },
    { key: "terminal", open: false, zIndex: 0 },
    { key: "notes", open: false, zIndex: 0 },
  ]);

  const [wallpaper, setWallpaper] = useState(
    localStorage.getItem("wallpaper") || "/wallpapers/mac.jpg"
  );
  const [showPicker, setShowPicker] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  // Bring clicked window to front
  const bringToFront = (key) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex));
      return prev.map((w) =>
        w.key === key ? { ...w, zIndex: maxZ + 1 } : w
      );
    });
  };

  // Toggle open/close of apps
  const toggleApp = (key) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.key === key ? { ...w, open: !w.open } : w
      )
    );
    bringToFront(key);
  };

  // Close app
  const closeApp = (key) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.key === key ? { ...w, open: false } : w
      )
    );
  };

  // Change wallpaper
  const handleWallpaperChange = (src) => {
    setWallpaper(src);
    localStorage.setItem("wallpaper", src);
    setShowPicker(false);
  };

  return (
    <>
      {isShuttingDown && <ShutdownScreen />}
      <div
        className="h-screen w-screen bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url('${wallpaper}')` }}
      >
        <TopBar />

        {/* App Windows */}
        {windows.map(
          (win) =>
            win.open && (
              <AppWindow
                key={win.key}
                title={win.key.charAt(0).toUpperCase() + win.key.slice(1)}
                onClose={() => closeApp(win.key)}
                onFocus={() => bringToFront(win.key)}
                zIndex={win.zIndex}
              >
                {win.key === "finder" && <FinderApp />}
                {win.key === "notes" && <NotesApp />}
                {win.key === "terminal" && (
                  <TerminalApp onOpenApp={toggleApp} />
                )}
              </AppWindow>
            )
        )}

        <Desktop toggleApp={toggleApp} />

        {/* Wallpaper Button */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="absolute bottom-24 right-6 bg-black/30 text-white px-4 py-2 rounded shadow z-50 backdrop-blur-sm hover:bg-black/50 transition"
        >
          🎨 Wallpaper
        </button>

        {showPicker && <WallpaperPicker onSelect={handleWallpaperChange} />}

        {/* Power Button */}
        <button
          onClick={() => {
            setIsShuttingDown(true);
            setTimeout(() => setIsShuttingDown(false), 2500);
          }}
          className="absolute top-2 right-4 bg-black/30 text-white px-3 py-1 text-xs rounded shadow backdrop-blur-sm hover:bg-black/50 transition z-50"
        >
          ⏻ Power
        </button>

        <Dock toggleApp={toggleApp} />
      </div>
    </>
  );
}

export default App;
