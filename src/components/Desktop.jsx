import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import ContextMenu from "./ContextMenu";
import { useApp } from "../context/AppContext";

const Desktop = ({ toggleApp }) => {
  const { fileSystem, setFileSystem, setActiveFolder } = useApp();

  const rootItems = fileSystem?.root || [];

  const [positions, setPositions] = useState({});
  const [selected, setSelected] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    mode: "desktop",
    itemIndex: null,
  });
  const [renamingIndex, setRenamingIndex] = useState(null);

  useEffect(() => {
    const savedPositions = JSON.parse(localStorage.getItem("desktopPositions") || "{}");
    setPositions(savedPositions);
  }, []);

  useEffect(() => {
    localStorage.setItem("desktopPositions", JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    const interval = setInterval(() => {
      const moved = JSON.parse(localStorage.getItem("finderMovedItems") || "[]");
      if (moved.length) {
        setFileSystem((prev) => ({ ...prev }));
        localStorage.setItem("finderMovedItems", "[]");
      }
    }, 500);
    return () => clearInterval(interval);
  }, [setFileSystem]);

  const handleNewFolder = () => {
    const baseName = "Untitled Folder";
    let name = baseName;
    let count = 1;
    while (rootItems.some((item) => item.name === name)) {
      name = `${baseName} (${count++})`;
    }
    const newFolder = { name, type: "folder" };

    const updatedFS = { ...fileSystem };
    updatedFS.root = [...(updatedFS.root || []), newFolder];
    setFileSystem(updatedFS);

    setPositions((prev) => ({ ...prev, [name]: { x: 100, y: 100 } }));
    setRenamingIndex(updatedFS.root.length - 1);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/finder-item");
    if (!raw) return;

    const { name, type, from } = JSON.parse(raw);
    if (fileSystem.root?.some((item) => item.name === name)) return;

    const updatedFS = { ...fileSystem };
    updatedFS[from] = (updatedFS[from] || []).filter((item) => item.name !== name);
    if (!updatedFS.root) updatedFS.root = [];
    updatedFS.root = [...updatedFS.root, { name, type }];
    setFileSystem(updatedFS);

    setPositions((prev) => ({
      ...prev,
      [name]: { x: e.clientX, y: e.clientY },
    }));

    const moved = JSON.parse(localStorage.getItem("finderMovedItems") || "[]");
    moved.push({ name, from });
    localStorage.setItem("finderMovedItems", JSON.stringify(moved));
    window.dispatchEvent(new Event("storage"));
  };

  const handleDelete = (itemName) => {
    const updatedTrash = JSON.parse(localStorage.getItem("deletedItems") || "[]");
    updatedTrash.push({ name: itemName, from: "root" });
    localStorage.setItem("deletedItems", JSON.stringify(updatedTrash));

    const updatedFS = { ...fileSystem };
    updatedFS.root = (updatedFS.root || []).filter((i) => i.name !== itemName);
    setFileSystem(updatedFS);

    setPositions((prev) => {
      const newPos = { ...prev };
      delete newPos[itemName];
      return newPos;
    });

    window.dispatchEvent(new Event("storage"));
  };

  const handleDoubleClick = (item) => {
    if (item.type === "folder") {
      setActiveFolder(item.name);
      toggleApp("finder");
    } else if (item.name === "Notes.txt") {
      toggleApp("notes");
    } else if (item.name === "Trash") {
      toggleApp("trash");
    } else {
      toggleApp("finder");
    }
  };

  return (
    <div
      className="absolute inset-0 select-none"
      onContextMenu={(e) => {
        if (!e.target.closest(".desktop-item")) {
          e.preventDefault();
          setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
           
            mode: "item",
            itemIndex: index,
          });
        }
      }}
      onClick={() => setContextMenu({ ...contextMenu, visible: false })}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{ userSelect: "none" }}
    >
      {rootItems.map((item, index) => {
        const pos = positions[item.name] || { x: 50 + index * 120, y: 50 };
        const icon = item.type === "folder" ? "📁" : item.name === "Trash" ? "🗑️" : "📄";

        return (
          <Rnd
            key={item.name}
            size={{ width: 80, height: 80 }}
            position={pos}
            onDragStop={(e, d) => {
              setPositions((prev) => ({ ...prev, [item.name]: { x: d.x, y: d.y } }));
            }}
            bounds="parent"
            enableResizing={false}
          >
            <div
              className={`desktop-item flex flex-col items-center justify-center cursor-pointer ${
                selected === index ? "bg-white/20 rounded-md" : ""
              }`}
              onClick={() => setSelected(index)}
              onDoubleClick={() => handleDoubleClick(item)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "application/finder-item",
                  JSON.stringify({
                    name: item.name,
                    type: item.type,
                    from: "root",
                  })
                );
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({
                  visible: true,
                  x: e.clientX,
                  y: e.clientY,
                  mode: "item",
                  itemIndex: index,
                });
              }}
            >
              <div className="text-4xl select-none">{icon}</div>
              {renamingIndex === index ? (
                <input
                  autoFocus
                  defaultValue={item.name}
                  onBlur={(e) => {
                    const newName = e.target.value.trim() || item.name;
                    const updatedFS = { ...fileSystem };
                    updatedFS.root = updatedFS.root.map((i) =>
                      i.name === item.name ? { ...i, name: newName } : i
                    );
                    setFileSystem(updatedFS);
                    setPositions((prev) => {
                      const updated = { ...prev };
                      updated[newName] = updated[item.name];
                      delete updated[item.name];
                      return updated;
                    });
                    setRenamingIndex(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                  className="text-white text-xs text-center mt-1 bg-black/20 outline-none"
                />
              ) : (
                <div className="text-white text-xs mt-1 truncate w-20 select-text">{item.name}</div>
              )}
            </div>
          </Rnd>
        );
      })}

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          mode={contextMenu.mode}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
          onNewFolder={handleNewFolder}
          onRename={() => setRenamingIndex(contextMenu.itemIndex)}
          onDelete={() => {
            if (contextMenu.mode === "item") {
              const nameToDelete = rootItems[contextMenu.itemIndex]?.name;
              if (nameToDelete) handleDelete(nameToDelete);
            }
          }}
          onChangeWallpaper={() => alert("Wallpaper change not implemented")}
          onShowInfo={() => {
            const item = rootItems[contextMenu.itemIndex];
            if (item) {
              alert(`📁 Name: ${item.name}\n🗂️ Type: ${item.type}\n📍 Path: root/${item.name}`);
            }
          }}
        />
      )}
    </div>
  );
};

export default Desktop;











