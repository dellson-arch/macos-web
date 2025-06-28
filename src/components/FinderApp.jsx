import { useState } from "react";

// Simulated file system (nested folders)
const fileSystem = {
  Documents: {},
  Photos: {},
  Music: {},
  Projects: {
    "App1.txt": "This is App1",
    "Readme.md": "Hello World"
  },
  "Resume.pdf": "This is your resume",
  "Notes.txt": "Some saved notes"
};

const FinderApp = () => {
  const [path, setPath] = useState([]); // ["Projects"]
  
  const getCurrentFolder = () => {
    return path.reduce((acc, key) => acc[key], fileSystem);
  };

  const handleClick = (name) => {
    const current = getCurrentFolder();
    const selected = current[name];
    
    if (typeof selected === "object") {
      setPath((prev) => [...prev, name]); // open folder
    } else {
      alert(`📄 Opening ${name}:\n\n${selected}`); // file preview
    }
  };

  const goBack = () => {
    setPath((prev) => prev.slice(0, -1));
  };

  const current = getCurrentFolder();

  return (
    <div className="bg-white h-full w-full p-4 text-black">
      <div className="mb-2 flex justify-between items-center">
        <div className="font-semibold">
          /{path.length === 0 ? "Home" : path.join("/")}
        </div>
        {path.length > 0 && (
          <button
            onClick={goBack}
            className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
          >
            ← Back
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        {Object.entries(current).map(([name, value], index) => (
          <div
            key={index}
            onClick={() => handleClick(name)}
            className="flex flex-col items-center justify-center hover:bg-gray-100 p-2 rounded cursor-pointer"
          >
            <div className="text-4xl">
              {typeof value === "object" ? "📁" : "📄"}
            </div>
            <div className="text-xs mt-1 truncate">{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinderApp;
