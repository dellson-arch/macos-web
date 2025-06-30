const TopBar = () => {
  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/30 text-white px-4 flex justify-between items-center text-sm font-medium backdrop-blur-sm z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <span className="text-lg">🍎</span>
        <span className="hover:underline cursor-pointer">Finder</span>
        <span className="hover:underline cursor-pointer">File</span>
        <span className="hover:underline cursor-pointer">Edit</span>
        <span className="hover:underline cursor-pointer">View</span>
        <span className="hover:underline cursor-pointer">Go</span>
        <span className="hover:underline cursor-pointer">Help</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <span className="text-xs opacity-80">🔋 100%</span>
        <span className="text-xs opacity-80">📶</span>
        <span className="text-xs opacity-80">{getTime()}</span>
      </div>
    </div>
  );
};

export default TopBar;

