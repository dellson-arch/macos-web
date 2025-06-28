import { useEffect, useState } from "react";

const TopBar = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-md text-white text-sm flex justify-between px-4 py-2 z-50 shadow-md">

      <div className="flex gap-4 font-medium">
        🍎 Finder File Edit View Go Window Help
      </div>
      <div>{time}</div>
    </div>
  );
};

export default TopBar;
