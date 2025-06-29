import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

const initialItems = [
  { name: "Projects", type: "folder", icon: "📁", appKey: "finder" },
  { name: "Resume.pdf", type: "file", icon: "📄", appKey: "finder" },
  { name: "Notes.txt", type: "file", icon: "📄", appKey: "notes" },
];

const Desktop = ({ toggleApp }) => {
  const [items, setItems] = useState(initialItems);
  const [positions, setPositions] = useState(
    initialItems.map((_, i) => ({
      x: 40 + i * 100,
      y: 40,
    }))
  );
  const [selected, setSelected] = useState(null);

  const handleDoubleClick = (item) => {
    toggleApp(item.appKey);
  };

  const updatePosition = (index, data) => {
    setPositions((prev) =>
      prev.map((pos, i) => (i === index ? { x: data.x, y: data.y } : pos))
    );
  };

  const handleDelete = (itemName) => {
    const idx = items.findIndex((i) => i.name === itemName);
    if (idx !== -1) {
      const newItems = [...items];
      const newPositions = [...positions];
      newItems.splice(idx, 1);
      newPositions.splice(idx, 1);
      setItems(newItems);
      setPositions(newPositions);
    }
  };

  // Listen to trash drop
  useEffect(() => {
    const handleStorage = () => {
      const deletedItems = JSON.parse(localStorage.getItem("deletedItems") || "[]");
      const deletedNames = deletedItems.map((d) => d.name);
      deletedNames.forEach(handleDelete);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [items, positions]);

  return (
    <div className="absolute inset-0 select-none">
      {items.map((item, index) => (
        <Rnd
          key={item.name}
          size={{ width: 80, height: 80 }}
          position={positions[index]}
          onDragStop={(e, d) => updatePosition(index, d)}
          bounds="parent"
          enableResizing={false}
        >
          <div
            className={`flex flex-col items-center justify-center cursor-pointer ${
              selected === index ? "bg-white/10 rounded-md" : ""
            }`}
            onClick={() => setSelected(index)}
            onDoubleClick={() => handleDoubleClick(item)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "app-item",
                JSON.stringify({
                  name: item.name,
                  type: item.type,
                  from: "root",
                })
              );
            }}
          >
            <div className="text-4xl">{item.icon}</div>
            <div className="text-white text-xs text-center mt-1">{item.name}</div>
          </div>
        </Rnd>
      ))}
    </div>
  );
};

export default Desktop;
