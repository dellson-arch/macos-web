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

// ✅ Default filesystem structure
const initialFileSystem = {
  root: [
    { name: "Documents", type: "folder" },
    { name: "Photos", type: "folder" },
    { name: "Resume.pdf", type: "file" },
    { name: "Notes.txt", type: "file" },
  ],
  Documents: [
    { name: "Project1", type: "folder" },
    { name: "Report.docx", type: "file" },
  ],
  Photos: [
    { name: "Vacation.jpg", type: "file" },
    { name: "Family.png", type: "file" },
  ],
  Project1: [
    { name: "code.js", type: "file" },
    { name: "README.md", type: "file" },
  ],
};

function App() {
  const [windows, setWindows] = useState([
    { key: "finder", open: true, zIndex: 1 },
    { key: "terminal", open: false, zIndex: 0 },
    { key: "notes", open: false, zIndex: 0 },
    { key: "trash", open: false, zIndex: 0 },
  ]);

  const [wallpaper, setWallpaper] = useState(
    localStorage.getItem("wallpaper") || "/wallpapers/mac.jpg"
  );
  const [showPicker, setShowPicker] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  // ✅ fileSystem state
const [fileSystem, setFileSystem] = useState(() => {
  const saved = localStorage.getItem("fileSystem");
  return saved ? JSON.parse(saved) : {
    root: [
      { name: "Documents", type: "folder" },
      { name: "Photos", type: "folder" },
      { name: "Resume.pdf", type: "file" },
      { name: "Notes.txt", type: "file" },
    ],
    Documents: [
      { name: "Project1", type: "folder" },
      { name: "Report.docx", type: "file" },
    ],
    Photos: [
      { name: "Vacation.jpg", type: "file" },
      { name: "Family.png", type: "file" },
    ],
    Project1: [
      { name: "code.js", type: "file" },
      { name: "README.md", type: "file" },
    ],
  };
});


useEffect(() => {
  localStorage.setItem("fileSystem", JSON.stringify(fileSystem));
}, [fileSystem]);

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
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex));
      return prev.map((w) => {
        if (w.key === key) {
          if (w.open) {
            return { ...w, zIndex: maxZ + 1 };
          }
          return { ...w, open: true, zIndex: maxZ + 1 };
        }
        return w;
      });
    });
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
