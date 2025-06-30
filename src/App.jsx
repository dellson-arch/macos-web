import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import Dock from "./components/Dock";
import AppWindow from "./components/AppWindow";
import FinderApp from "./components/FinderApp";
import Desktop from "./components/Desktop";
import NotesApp from "./components/NotesApp";
import TerminalApp from "./components/TerminalApp";
import WallpaperPicker from "./components/WallpaperPicker";
import ShutdownScreen from "./components/ShutdownScreen";
import TrashApp from "./components/TrashApp";
import { useApp } from "./context/AppContext";

function App() {
  const {
    fileSystem,
    setFileSystem,
    windows,
    toggleApp,
    bringToFront,
    closeApp,
    wallpaper,
    setWallpaper,
  } = useApp();

  const [showPicker, setShowPicker] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

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
                {win.key === "finder" && (
                  <FinderApp
                    fileSystem={fileSystem}
                    setFileSystem={setFileSystem}
                  />
                )}
                {win.key === "notes" && <NotesApp />}
                {win.key === "terminal" && (
                  <TerminalApp onOpenApp={toggleApp} />
                )}
                {win.key === "trash" && (
                  <TrashApp
                    fileSystem={fileSystem}
                    setFileSystem={setFileSystem}
                  />
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

        <Dock toggleApp={toggleApp} />
      </div>
    </>
  );
}

export default App;
