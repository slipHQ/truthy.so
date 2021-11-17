import { useEffect, useRef, FC, useMemo } from "react";
import { useMonaco } from "@monaco-editor/react";
import { useEditor } from "./Editor";
import LineHighlights from "./LineHighlights";
import LineDecoration from "./LineDecoration";
import useLineCount from "../hooks/useLineCount";

const useLatest = <T extends any>(value: T): { readonly current: T } => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

function range(size: number, startAt = 0) {
  return Array.from(new Array(size), (x, i) => i + startAt);
}

interface LineSelectorProps {
  lines: number[];
  onChange?: (lines: number[]) => void;
}

const LineSelector: FC<LineSelectorProps> = ({ lines = [], onChange }) => {
  const monaco = useMonaco();
  const editor = useEditor();
  const numLines = useLineCount();
  const latest = {
    onChange: useLatest(onChange),
  };

  const lineOptions = useMemo(() => range(numLines, 1), [numLines]);
  const lineSet = useMemo(() => new Set(lines), [JSON.stringify(lines)]);

  useEffect(() => {
    if (editor) {
      const disposable = editor.onMouseDown((e) => {
        if (
          e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
        ) {
          editor.focus();
          if (lineSet.has(e.target.position.lineNumber)) {
            latest.onChange.current?.(
              lines.filter((l) => l !== e.target.position.lineNumber)
            );
          } else {
            latest.onChange.current?.([...lines, e.target.position.lineNumber]);
          }
        }
      });
      return () => {
        disposable.dispose();
      };
    }
  }, [editor, JSON.stringify(lines)]);

  return (
    <>
      {lineOptions.map((line) => {
        const isLineSelected = lineSet.has(line);
        return (
          <LineDecoration
            key={line} // need a way to identify lines
            line={line}
            lineClass={isLineSelected ? "editor-highlight-line" : undefined}
            glyphMarginClass={isLineSelected ? "remove-icon" : "add-icon"}
          />
        );
      })}
    </>
  );
};

export default LineSelector;
