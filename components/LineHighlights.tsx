import { useEffect, useRef, FC } from "react";
import { useMonaco } from "@monaco-editor/react";
import { useEditor } from "./Editor";

interface LineHighlightsProps {
  lines?: number[];
}

const LineHighlights: FC<LineHighlightsProps> = ({ lines = [] }) => {
  const monaco = useMonaco();
  const editor = useEditor();
  const prevDecorationsRef = useRef([]);

  useEffect(() => {
    prevDecorationsRef.current = editor?.deltaDecorations(
      prevDecorationsRef.current || [],
      lines.map((line) => ({
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: "editor-highlight-line",
          glyphMarginClassName: "editor-glyph",
        },
      }))
    );
  }, [editor, JSON.stringify(lines)]);

  return null;
};

export default LineHighlights;
