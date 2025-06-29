import { useState } from "react";

const FinderApp = ({ fileSystem, setFileSystem }) => {
  const [currentFolder, setCurrentFolder] = useState("root");
  const [history, setHistory] = useState(["root"]);

 const deleteItem = (item) => {
  // Save the deleted item with original folder info
  const updatedTrash = JSON.parse(localStorage.getItem("deletedItems") || "[]");
  updatedTrash.push({ name: item.name, from: currentFolder });
  localStorage.setItem("deletedItems", JSON.stringify(updatedTrash));

  // Remove item from current folder
  const updatedFS = {
    ...fileSystem,
    [currentFolder]: (fileSystem[currentFolder] || []).filter((i) => i.name !== item.name),
  };

  setFileSystem(updatedFS);
};


  const openItem = (item) => {
    if (item.type === "folder") {
      setCurrentFolder(item.name);
      setHistory((prev) => [...prev, item.name]);
    } else {
      alert(`Opening ${item.name}`);
    }
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setCurrentFolder(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  };

  
  const items = fileSystem[currentFolder] || [];

  return (
    <div className="bg-white h-full w-full p-4 text-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold text-lg">{currentFolder}</h2>
        <button onClick={goBack} className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">⬅ Back</button>
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        {items.map((item, index) => (
          <div
            key={index}
            onDoubleClick={() => openItem(item)}
            className="flex flex-col items-center justify-center hover:bg-gray-100 p-2 rounded cursor-pointer relative group"
          >
            <div className="text-4xl">{item.type === "folder" ? "📁" : "📄"}</div>
            <div className="text-xs mt-1 truncate">{item.name}</div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteItem(item);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100 transition"
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinderApp;
