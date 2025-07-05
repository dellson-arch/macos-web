import React, { useState } from "react";
import { Rnd } from "react-rnd";

const Safari = ({ onClose }) => {
const [url, setUrl] = useState("https://en.wikipedia.org");
const [goUrl, setGoUrl] = useState("https://en.wikipedia.org");

  return (
    <Rnd
      default={{ x: 100, y: 100, width: 800, height: 600 }}
      bounds="parent"
      minWidth={300}
      minHeight={200}
      dragHandleClassName="safari-header"
    >
      <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
        {/* Title & Controls */}
        <div className="safari-header flex items-center justify-between bg-gray-200 px-2 py-1">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-1 text-sm border border-gray-300 rounded"
            placeholder="Enter URL"
          />
          <button
            className="ml-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
            onClick={() => setGoUrl(url)}
          >
            Go
          </button>
          <button
            className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        {/* Scrollable iframe area */}
        <div className="flex-1 overflow-auto">
          <iframe
            src={goUrl}
            title="Safari"
            className="w-full"
            style={{
              height: "100%",
              minHeight: "600px", // let iframe content scroll
              border: "none",
            }}
          />
        </div>
      </div>
    </Rnd>
  );
};

export default Safari;








//https://wikipedia.org