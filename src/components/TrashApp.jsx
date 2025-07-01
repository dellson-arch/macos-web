import { useApp } from "../context/AppContext";

const TrashApp = () => {
  const {
    trashItems,
    setTrashItems,
    fileSystem,
    setFileSystem,
  } = useApp();

  // Restore item from trash to original folder
  const restoreItem = (item) => {
    // Remove from trash
    const updatedTrash = trashItems.filter(
      (i) => i.name !== item.name || i.from !== item.from
    );
    setTrashItems(updatedTrash);

    const updatedFS = { ...fileSystem };
    const targetFolder = item.from || "root";

    if (!updatedFS[targetFolder]) {
      updatedFS[targetFolder] = [];
    }

    updatedFS[targetFolder].push({
      name: item.name,
      type: item.type,
    });

    setFileSystem(updatedFS);
  };

  // Permanently delete item from trash
  const deleteForever = (item) => {
    const updated = trashItems.filter(
      (i) => i.name !== item.name || i.from !== item.from
    );
    setTrashItems(updated);
  };

  return (
    <div className="p-4 text-white h-full overflow-auto bg-black/80">
      <h2 className="text-xl font-bold mb-2">🗑 Trash</h2>

      {trashItems.length === 0 ? (
        <p className="text-gray-400">Trash is empty.</p>
      ) : (
        <ul className="list-disc pl-6 space-y-2">
          {trashItems.map((item, idx) => (
            <li key={idx} className="text-sm flex items-center justify-between">
              <div>
                {item.name}
                <span className="text-gray-400 text-xs ml-2">({item.from})</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => restoreItem(item)}
                  className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded hover:bg-blue-700"
                >
                  Restore
                </button>
                <button
                  onClick={() => deleteForever(item)}
                  className="bg-red-600 text-white text-xs px-2 py-0.5 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrashApp;
