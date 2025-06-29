import { useState, useEffect } from "react";

const TrashApp = ({ fileSystem, setFileSystem }) => {
  const [deletedItems, setDeletedItems] = useState(() =>
    JSON.parse(localStorage.getItem("deletedItems") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("deletedItems", JSON.stringify(deletedItems));
  }, [deletedItems]);

 const restoreItem = (item) => {
  const updatedTrash = deletedItems.filter((i) => i.name !== item.name);
  setDeletedItems(updatedTrash);

  const type = item.name.includes(".") ? "file" : "folder";
  const targetFolder = item.from || "root";

  const updatedFS = {
    ...fileSystem,
    [targetFolder]: [...(fileSystem[targetFolder] || []), { name: item.name, type }],
  };

  setFileSystem(updatedFS);
};


  return (
    <div className="p-4 text-white h-full overflow-auto">
      <h2 className="text-xl font-bold mb-2">🗑 Trash</h2>

      {deletedItems.length === 0 ? (
        <p className="text-gray-400">Trash is empty.</p>
      ) : (
        <ul className="list-disc pl-6 space-y-2">
         {deletedItems.map((item, idx) => (
  <li key={idx} className="text-sm flex items-center justify-between">
    {item.name} <span className="text-gray-400 text-xs ml-2">({item.from})</span>
    <button
      onClick={() => restoreItem(item)}
      className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded hover:bg-blue-700 ml-2"
    >
      Restore
    </button>
  </li>
))}

        </ul>
      )}
    </div>
  );
};

export default TrashApp;
