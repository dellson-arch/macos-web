// components/ContextMenu.jsx
const ContextMenu = ({
  x,
  y,
  mode,
  onClose,
  onNewFolder,
  onChangeWallpaper,
  onRename,
  onDelete,
}) => {
  return (
    <div
      className="absolute z-[9999] bg-white text-sm rounded-md shadow-md overflow-hidden"
      style={{ top: y, left: x }}
      onMouseLeave={onClose}
    >
      {mode === "desktop" && (
        <>
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onNewFolder();
              onClose();
            }}
          >
            ➕ New Folder
          </div>
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onChangeWallpaper();
              onClose();
            }}
          >
            🎨 Change Wallpaper
          </div>
        </>
      )}

      {mode === "item" && (
        <>
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onRename();
              onClose();
            }}
          >
            ✏️ Rename
          </div>
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            🗑️ Delete
          </div>
        </>
      )}
    </div>
  );
};

export default ContextMenu;
