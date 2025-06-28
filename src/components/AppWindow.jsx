import { Rnd } from "react-rnd";
import { useState } from "react";

const AppWindow = ({ title, onClose, children }) => {
  const [minimized, setMinimized] = useState(false);

  return (
 <Rnd
  default={{ x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 200, width: 600, height: 400 }}
  minWidth={300}
  minHeight={200}
  bounds="parent"
  dragHandleClassName="drag-handle"
  className="bg-white/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden"
 >
      {/* Top bar with macOS-style controls */}
      <div className="bg-gray-800/80 text-white px-4 py-2 flex justify-between items-center drag-handle">
        <div className="flex gap-2">
          <div
            className="h-3 w-3 rounded-full bg-red-500 hover:brightness-110 cursor-pointer"
            onClick={onClose}
          ></div>
          <div
            className="h-3 w-3 rounded-full bg-yellow-400 hover:brightness-110 cursor-pointer"
            onClick={() => setMinimized(!minimized)}
          ></div>
          <div className="h-3 w-3 rounded-full bg-green-500 hover:brightness-110 cursor-pointer"></div>
        </div>
        <span className="text-sm font-semibold">{title}</span>
        <div className="w-6"></div>
      </div>

      {!minimized && (
        <div className="flex-1 p-4 overflow-auto bg-white/60 text-black">
          {children}
        </div>
      )}
    </Rnd>
  );
};

export default AppWindow;
