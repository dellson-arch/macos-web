const wallpapers = [
  "/wallpapers/mac.jpg",
  "/wallpapers/desert.webp",
  "/wallpapers/mountain.jpg",
  "/wallpapers/sunset.avif",
  "/wallpapers/ventura.webp",
];

const WallpaperPicker = ({ onSelect }) => {
  return (
    <div className="absolute bottom-24 left-6 bg-white/40 backdrop-blur-md p-4 rounded-lg shadow-md z-50">
      <h3 className="text-white text-sm mb-2">Choose Wallpaper</h3>
      <div className="grid grid-cols-3 gap-2">
        {wallpapers.map((src, index) => (
          <img
            key={index}
            src={src}
            className="w-24 h-16 object-cover rounded-md cursor-pointer hover:scale-105 transition"
            onClick={() => onSelect(src)}
            alt="wallpaper"
          />
        ))}
      </div>
    </div>
  );
};

export default WallpaperPicker;
