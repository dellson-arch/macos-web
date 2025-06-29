import { useState, useEffect } from "react";

const NotesApp = () => {
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("notesData");
    if (saved) setText(saved);
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
    localStorage.setItem("notesData", e.target.value);
  };

  return (
    <textarea
      value={text}
      onChange={handleChange}
      className="w-full h-full bg-transparent text-white text-base p-4 font-mono outline-none resize-none"
      placeholder="Type your notes here..."
    />
  );
};

export default NotesApp;
