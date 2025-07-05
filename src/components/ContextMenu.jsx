import React from "react";

const ContextMenu = ({
  x,
  y,
  mode,
  onClose,
  onNewFolder,
  onRename,
  onDelete,
  onChangeWallpaper,
  onShowInfo,
  onNewApp, // ✅ Accept as prop
}) => {
  return (
    <div
      className="absolute bg-white text-sm border rounded shadow-lg z-50"
      style={{ top: y, left: x }}
    >
      <ul>
        {mode === "desktop" && (
          <>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onNewFolder();
                onClose();
              }}
            >
              📁 New Folder
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onNewApp(); // ✅ Add Safari from desktop right-click
                onClose();
              }}
            >
              🧭 New Safari
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChangeWallpaper();
                onClose();
              }}
            >
              🖼 Change Wallpaper
            </li>
          </>
        )}

        {mode === "item" && (
          <>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onRename();
                onClose();
              }}
            >
              ✏️ Rename
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onShowInfo();
                onClose();
              }}
            >
              ℹ️ Show Info
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
              onClick={() => {
                onDelete();
                onClose();
              }}
            >
              🗑 Move to Trash
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ContextMenu;
