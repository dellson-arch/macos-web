const ShutdownScreen = () => {
  return (
    <div className="absolute inset-0 bg-black text-white flex flex-col justify-center items-center z-[9999]">
      <img
        src="https://cdn.freelogovectors.net/svg14/applelogo-freelogovectors.net.svg"
        alt="Apple Logo"
        className="w-16 h-16 mb-4 opacity-80"
      />
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0s]"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
      </div>
    </div>
  );
};

export default ShutdownScreen;
