import { useState } from "react";

const desktopItems = [
  { name: "Projects", type: "folder", icon: "📁", appKey: "finder" },
  { name: "Resume.pdf", type: "file", icon: "📄", appKey: "finder" },
  { name: "Notes.txt", type: "file", icon: "📄", appKey: "notes" },
];

const Desktop = ({ toggleApp }) => {
  const [selected, setSelected] = useState(null);

  const handleDoubleClick = (item) => {
    toggleApp(item.appKey);
  };

  return (
    <div className="absolute inset-0 p-4 select-none">
      {desktopItems.map((item, index) => (
        <div
          key={index}
          className={`w-20 flex flex-col items-center mb-6 cursor-pointer ${
            selected === index ? "bg-white/10 rounded-md" : ""
          }`}
          onClick={() => setSelected(index)}
          onDoubleClick={() => handleDoubleClick(item)}
          style={{ position: "absolute", left: `${index * 100}px`, top: "40px" }}
        >
          <div className="text-4xl">{item.icon}</div>
          <div className="text-white text-xs text-center mt-1">{item.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Desktop;
