const apps = [
  { key: "finder", icon: "/icons/finder.png", name: "Finder" },
  { key: "notes", icon: "/icons/notes.png", name: "Notes" },
  { key: "terminal", icon: "/icons/terminal.png", name: "Terminal" },
  { key: "trash", icon: "/icons/trash.png", name: "Trash" },
];

const Dock = ({ toggleApp }) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-xl flex gap-6 shadow-xl">
      {apps.map((app) => (
        <img
          key={app.key}
          src={app.icon}
          alt={app.name}
          title={app.name}
          className="w-10 h-10 hover:scale-125 transition duration-200 cursor-pointer"
          onClick={() => toggleApp(app.key)} // ✅ This line makes icons functional!
        />
      ))}
    </div>
  );
};

export default Dock;
