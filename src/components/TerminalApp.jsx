import { useState, useRef, useEffect } from "react";

const TerminalApp = ({ onOpenApp }) => {
  const [lines, setLines] = useState([
    "Welcome to macOS Terminal!",
    "Type 'help' to see available commands.",
  ]);
  const [input, setInput] = useState("");
  const terminalRef = useRef(null);

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [lines]);

  const handleCommand = () => {
    const cmd = input.trim();
    const output = executeCommand(cmd);
    setLines([...lines, `$ ${cmd}`, ...output]);
    setInput("");
  };

  const executeCommand = (cmd) => {
    if (cmd === "help") {
      return [
        "Available commands:",
        "- help",
        "- ls",
        "- open Notes.txt",
        "- clear",
        "- exit",
      ];
    }
    if (cmd === "ls") {
      return ["Documents", "Photos", "Resume.pdf", "Notes.txt"];
    }
    if (cmd === "clear") {
      setLines([]);
      return [];
    }
    if (cmd.startsWith("open")) {
      const app = cmd.split(" ")[1];
      if (app === "Notes.txt") {
        onOpenApp("notes");
        return [`Opening Notes...`];
      }
      if (app === "Resume.pdf") {
        onOpenApp("finder");
        return [`Opening Resume...`];
      }
      return [`Cannot open ${app}`];
    }
    if (cmd === "exit") {
      onOpenApp("terminal"); // toggles it off
      return [];
    }
    return [`Command not found: ${cmd}`];
  };

  return (
    <div className="w-full h-full bg-black text-green-400 font-mono p-4 overflow-y-auto" ref={terminalRef}>
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}

      <div className="flex">
        <span className="mr-1">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCommand();
          }}
          className="bg-transparent outline-none text-green-400 w-full"
          autoFocus
        />
      </div>
    </div>
  );
};

export default TerminalApp;
