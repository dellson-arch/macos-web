import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

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

export const AppProvider = ({ children }) => {
  const [fileSystem, setFileSystem] = useState(() => {
    const saved = localStorage.getItem("fileSystem");
    return saved ? JSON.parse(saved) : initialFileSystem;
  });

  const [wallpaper, setWallpaper] = useState(
    localStorage.getItem("wallpaper") || "/wallpapers/mac.jpg"
  );

  const [windows, setWindows] = useState([
    { key: "finder", open: true, zIndex: 1 },
    { key: "terminal", open: false, zIndex: 0 },
    { key: "notes", open: false, zIndex: 0 },
    { key: "trash", open: false, zIndex: 0 },
  ]);

  const [activeFolder, setActiveFolder] = useState("root");

  useEffect(() => {
    localStorage.setItem("fileSystem", JSON.stringify(fileSystem));
  }, [fileSystem]);

  const toggleApp = (key) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex));
      return prev.map((w) =>
        w.key === key
          ? { ...w, open: true, zIndex: maxZ + 1 }
          : w
      );
    });
  };

  const bringToFront = (key) => {
    const maxZ = Math.max(...windows.map((w) => w.zIndex));
    setWindows((prev) =>
      prev.map((w) => (w.key === key ? { ...w, zIndex: maxZ + 1 } : w))
    );
  };

  const closeApp = (key) => {
    setWindows((prev) =>
      prev.map((w) => (w.key === key ? { ...w, open: false } : w))
    );
  };

  return (
    <AppContext.Provider
      value={{
        fileSystem,
        setFileSystem,
        windows,
        setWindows,
        toggleApp,
        closeApp,
        bringToFront,
        wallpaper,
        setWallpaper,
        activeFolder,
        setActiveFolder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
