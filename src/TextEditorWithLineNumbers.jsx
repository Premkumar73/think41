import React, { useRef, useState, useEffect } from "react";

export default function TextEditorWithLineNumbers() {
  const [text, setText] = useState("");
  const [jumpLine, setJumpLine] = useState("");
  const [highlightLine, setHighlightLine] = useState(null);
  const textAreaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const syncScroll = () => {
    if (lineNumbersRef.current && textAreaRef.current) {
      lineNumbersRef.current.scrollTop = textAreaRef.current.scrollTop;
    }
  };

  const getLineNumbers = () => {
    const lines = text.split("\n").length;
    return Array.from({ length: lines }, (_, i) => i + 1).join("\n");
  };

  const handleJump = () => {
    const line = parseInt(jumpLine);
    if (!isNaN(line) && line > 0) {
      const lineHeight = 20;
      textAreaRef.current.scrollTop = (line - 1) * lineHeight;
      setHighlightLine(line);
    } else {
      alert("Please enter a valid line number");
    }
  };

  useEffect(() => {
    if (highlightLine !== null && textAreaRef.current) {
      const lines = text.split("\n");
      const start =
        lines.slice(0, highlightLine - 1).join("\n").length +
        (highlightLine > 1 ? 1 : 0);
      const end = start + (lines[highlightLine - 1]?.length || 0);

      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(start, end);
    }
  }, [highlightLine]);

  return (
    <div className="container my-4">
      <h2 className="mb-4">Text Editor with Line Numbers & Jump</h2>

      <div className="d-flex border rounded overflow-hidden" style={{ height: "320px" }}>
        <textarea
          ref={lineNumbersRef}
          value={getLineNumbers()}
          readOnly
          className="form-control text-end text-secondary bg-light border-end-0"
          style={{
            width: "50px",
            resize: "none",
            lineHeight: "20px",
            overflowY: "scroll",
            fontFamily: "monospace",
          }}
        />

        <textarea
          ref={textAreaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onScroll={syncScroll}
          className="form-control border-start-0"
          style={{
            resize: "none",
            lineHeight: "20px",
            fontFamily: "monospace",
            overflowY: "scroll",
          }}
          placeholder="Type your text here..."
        />
      </div>

      <div className="mt-3 d-flex align-items-center gap-2">
        <input
          type="number"
          value={jumpLine}
          onChange={(e) => setJumpLine(e.target.value)}
          className="form-control w-25"
          placeholder="Jump to line..."
        />
        <button className="btn btn-primary" onClick={handleJump}>
          Jump
        </button>
      </div>

      <div className="mt-3">
        <input
          type="file"
          accept=".txt"
          className="form-control w-50"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                setText(e.target.result);
              };
              reader.readAsText(file);
            }
          }}
        />
      </div>
    </div>
  );
}
