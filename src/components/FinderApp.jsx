import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

const FinderApp = () => {
  const {
    fileSystem,
    setFileSystem,
    setActiveFolder,
  } = useApp();

  const [path, setPath] = useState(["root"]);
  const [renamingIndex, setRenamingIndex] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, index: null });

  const currentFolder = path[path.length - 1];
  const items = fileSystem[currentFolder] || [];

  const deleteItem = (item) => {
    const updatedTrash = JSON.parse(localStorage.getItem("deletedItems") || "[]");
    updatedTrash.push({ name: item.name, from: currentFolder });
    localStorage.setItem("deletedItems", JSON.stringify(updatedTrash));

    const updatedFS = {
      ...fileSystem,
      [currentFolder]: items.filter((i) => i.name !== item.name),
    };

    setFileSystem(updatedFS);
    window.dispatchEvent(new Event("storage"));
  };

  const openItem = (item) => {
    if (item.type === "folder") {
      setPath([...path, item.name]);
      setActiveFolder(item.name);
    } else {
      alert(`Opening ${item.name}`);
    }
  };

  const goBack = () => {
    if (path.length > 1) {
      const newPath = [...path];
      newPath.pop();
      setPath(newPath);
      setActiveFolder(newPath[newPath.length - 1]);
    }
  };

  const handleRename = (index, newName) => {
    const updatedFS = { ...fileSystem };
    updatedFS[currentFolder][index].name = newName;
    setFileSystem(updatedFS);
    setRenamingIndex(null);
  };

const handleDrop = (e) => {
  e.preventDefault();

  console.log("🔥 Drop Triggered");

  const raw = e.dataTransfer.getData("application/finder-item");
  if (!raw) return;

  const { name, type, from } = JSON.parse(raw);
  console.log("📦 Dropped Data:", { name, type, from });

  // Skip if dropped into same folder
  if (from === currentFolder) return;

  const updatedFS = { ...fileSystem };

  // Remove from old folder
  updatedFS[from] = (updatedFS[from] || []).filter((item) => item.name !== name);

  // Add to current folder
  updatedFS[currentFolder] = [...(updatedFS[currentFolder] || []), { name, type }];

  setFileSystem(updatedFS);

  // Mark as moved (for syncing Desktop)
  const moved = JSON.parse(localStorage.getItem("finderMovedItems") || "[]");
  moved.push({ name, from });
  localStorage.setItem("finderMovedItems", JSON.stringify(moved));

  window.dispatchEvent(new Event("storage"));
};


  const handleDragStart = (e, item) => {
    const data = JSON.stringify({ name: item.name, type: item.type, from: currentFolder });
    e.dataTransfer.setData("application/finder-item", data);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const moved = JSON.parse(localStorage.getItem("finderMovedItems") || "[]");
      if (moved.length) {
        setFileSystem((prev) => ({ ...prev }));
        localStorage.setItem("finderMovedItems", "[]");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [fileSystem]);

  return (
    <div
      className="bg-white h-full w-full p-4 text-gray-800 relative"
 onClick={() => setContextMenu({ visible: false, x: 0, y: 0, index: null })}
  onDragOver={(e) => e.preventDefault()}
  onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-bold text-lg">📁 {currentFolder}</h2>
          <p className="text-xs text-gray-500">{path.join(" / ")}</p>
        </div>
        <button
          onClick={goBack}
          disabled={path.length === 1}
          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ⬅ Back
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        {items.map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDoubleClick={() => openItem(item)}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu({ visible: true, x: e.clientX, y: e.clientY, index });
            }}
            className="flex flex-col items-center justify-center hover:bg-gray-100 p-2 rounded cursor-pointer"
          >
            <div className="text-4xl">{item.type === "folder" ? "📁" : "📄"}</div>
            {renamingIndex === index ? (
              <input
                autoFocus
                defaultValue={item.name}
                onBlur={(e) => handleRename(index, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename(index, e.target.value)}
                className="text-xs mt-1 text-center border border-gray-300 rounded px-1 w-full"
              />
            ) : (
              <div className="text-xs mt-1 truncate">{item.name}</div>
            )}
          </div>
        ))}
      </div>

      {contextMenu.visible && (
        <div
          className="absolute bg-white border rounded shadow z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <ul className="text-sm">
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setRenamingIndex(contextMenu.index);
                setContextMenu({ ...contextMenu, visible: false });
              }}
            >
              📝 Rename
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                deleteItem(items[contextMenu.index]);
                setContextMenu({ ...contextMenu, visible: false });
              }}
            >
              🗑 Delete
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FinderApp;
