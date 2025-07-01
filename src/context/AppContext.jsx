import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

// 🌱 Initial File System Setup
const initialFileSystem = {
  root: [
    { name: "Documents", type: "folder", path: "root/Documents" },
    { name: "Photos", type: "folder", path: "root/Photos" },
    { name: "Resume.pdf", type: "file", path: "root/Resume.pdf" },
    { name: "Notes.txt", type: "file", path: "root/Notes.txt" },
  ],
  Documents: [
    { name: "Project1", type: "folder", path: "Documents/Project1" },
    { name: "Report.docx", type: "file", path: "Documents/Report.docx" },
  ],
  Photos: [
    { name: "Vacation.jpg", type: "file", path: "Photos/Vacation.jpg" },
    { name: "Family.png", type: "file", path: "Photos/Family.png" },
  ],
  Project1: [
    { name: "code.js", type: "file", path: "Project1/code.js" },
    { name: "README.md", type: "file", path: "Project1/README.md" },
  ],
};

export const AppProvider = ({ children }) => {
  // 📁 File System
  const [fileSystem, setFileSystem] = useState(() => {
    const saved = localStorage.getItem("fileSystem");
    return saved ? JSON.parse(saved) : initialFileSystem;
  });

  // 🗑 Trash Items (Global)
  const [trashItems, setTrashItems] = useState(() => {
    const saved = localStorage.getItem("trashItems");
    return saved ? JSON.parse(saved) : [];
  });

  // 🖼 Wallpaper
  const [wallpaper, setWallpaper] = useState(
    localStorage.getItem("wallpaper") || "/wallpapers/mac.jpg"
  );

  // 🪟 App Window State
  const [windows, setWindows] = useState([
    { key: "finder", open: true, zIndex: 1 },
    { key: "terminal", open: false, zIndex: 0 },
    { key: "notes", open: false, zIndex: 0 },
    { key: "trash", open: false, zIndex: 0 },
  ]);

  // 📂 Currently Opened Folder
  const [activeFolder, setActiveFolder] = useState("root");

  // 🔁 Persist fileSystem on change
  useEffect(() => {
    localStorage.setItem("fileSystem", JSON.stringify(fileSystem));
  }, [fileSystem]);

  // 🔁 Persist trashItems on change
  useEffect(() => {
    localStorage.setItem("trashItems", JSON.stringify(trashItems));
  }, [trashItems]);

  // 📤 Open/Focus Apps
  const toggleApp = (key) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex));
      return prev.map((w) =>
        w.key === key ? { ...w, open: true, zIndex: maxZ + 1 } : w
      );
    });
  };

  // 👆 Bring App to Front
  const bringToFront = (key) => {
    const maxZ = Math.max(...windows.map((w) => w.zIndex));
    setWindows((prev) =>
      prev.map((w) => (w.key === key ? { ...w, zIndex: maxZ + 1 } : w))
    );
  };

  // ❌ Close App Window
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
        trashItems,
        setTrashItems,
        wallpaper,
        setWallpaper,
        windows,
        setWindows,
        toggleApp,
        bringToFront,
        closeApp,
        activeFolder,
        setActiveFolder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
