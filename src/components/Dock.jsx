import { useState } from "react";
import { useApp } from "../context/AppContext"; // 🔁 use global context

const Dock = ({ toggleApp }) => {
  const [dragOverTrash, setDragOverTrash] = useState(false);
  const { trashItems, setTrashItems, fileSystem, setFileSystem } = useApp();

  // 🗑 Handle dropping item onto trash
  const handleDrop = (e) => {
    const itemData = JSON.parse(
      e.dataTransfer.getData("application/finder-item")
    );
    if (!itemData) return;

    const { name, type, from } = itemData;

    // ❌ Remove from original folder
    const updatedFS = { ...fileSystem };
    updatedFS[from] = (updatedFS[from] || []).filter(
      (item) => item.name !== name
    );
    setFileSystem(updatedFS);

    // 🗑 Add to trashItems context
    setTrashItems((prev) => [
      ...prev,
      { name, type, from, path: `${from}/${name}` } // 🔁 added path for restore support
    ]);

    setDragOverTrash(false);
  };

  // 🧭 App icons + dynamic trash state
  const apps = [
    { key: "finder", icon: "/icons/finder.png", name: "Finder" },
    { key: "notes", icon: "/icons/notes.png", name: "Notes" },
    { key: "terminal", icon: "/icons/terminal.png", name: "Terminal" },
    {
      key: "trash",
      icon: trashItems.length > 0
        ? "/icons/trash-full.png"
        : "/icons/trash.png",
      name: `Trash (${trashItems.length})`, // 🧠 Smart label
    },
  ];

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-xl flex gap-6 shadow-xl">
      {apps.map((app) => (
        <div
          key={app.key}
          className="flex flex-col items-center group relative"
          onClick={() => toggleApp(app.key)}
          onDragOver={(e) => {
            if (app.key === "trash") {
              e.preventDefault();
              setDragOverTrash(true);
            }
          }}
          onDragLeave={() => {
            if (app.key === "trash") setDragOverTrash(false);
          }}
          onDrop={(e) => {
            if (app.key === "trash") handleDrop(e);
          }}
        >
          <img
            src={app.icon}
            alt={app.name}
            title={app.name} // 🧠 shows "Trash (3)" etc
            className={`w-10 h-10 transition-transform duration-300 cursor-pointer ${
              dragOverTrash && app.key === "trash"
                ? "scale-125 brightness-150"
                : "hover:scale-125"
            }`}
          />
          {app.key === "trash" && dragOverTrash && (
            <div className="absolute -top-6 text-xs text-white bg-red-500 px-2 py-0.5 rounded shadow">
              Drop to Delete
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dock;
