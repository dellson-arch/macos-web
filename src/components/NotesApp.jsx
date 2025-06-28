import { useState, useEffect } from "react";

const NotesApp = () => {
  const [text, setText] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setText(saved);
  }, []);

  // Save to localStorage whenever text changes
  useEffect(() => {
    localStorage.setItem("notes", text);
  }, [text]);

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      className="w-full h-full bg-transparent text-white text-base p-4 font-mono outline-none resize-none"
      placeholder="Type your notes here..."
    />
  );
};

export default NotesApp;
