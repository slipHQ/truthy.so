import { useEffect, useRef, FC, useMemo } from "react";
import { useMonaco } from "@monaco-editor/react";
import { useEditor } from "./Editor";
import LineHighlights from "./LineHighlights";
import LineDecoration from "./LineDecoration";
import useLineCount from "../hooks/useLineCount";

function range(size: number, startAt = 0) {
  return Array.from(new Array(size), (x, i) => i + startAt);
}

interface LineSelectorProps {
  lines: number[];
  onChange?: (lines: number[]) => void;
}

const LineSelector: FC<LineSelectorProps> = ({ lines }) => {
  //   const monaco = useMonaco();
  const editor = useEditor();
  const numLines = useLineCount();

  const lineOptions = useMemo(() => range(numLines, 1), [numLines]);

  useEffect(() => {
    if (editor) {
      const disposable = editor.onMouseDown((e) => {
        console.log(e.target);
      });
      return () => {
        disposable.dispose();
      };
    }
  }, [editor]);

  return (
    <>
      {lineOptions.map((line) => (
        <LineDecoration
          key={line}
          line={line}
          lineClass={
            lines?.includes(line) ? "editor-highlight-line" : undefined
          }
        />
      ))}
    </>
  );
};

export default LineSelector;
