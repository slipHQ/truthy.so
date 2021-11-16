import { useEffect, useRef, FC } from "react";
import { useMonaco } from "@monaco-editor/react";
import { useEditor } from "./Editor";

interface LineDecorationProps {
  line: number;
  lineClass?: string;
  glyphMarginClass?: string;
}

const LineDecoration: FC<LineDecorationProps> = ({
  line,
  lineClass,
  glyphMarginClass,
}) => {
  const monaco = useMonaco();
  const editor = useEditor();
  const prevDecorationsRef = useRef([]);

  useEffect(() => {
    if (editor && monaco) {
      prevDecorationsRef.current = editor?.deltaDecorations(
        prevDecorationsRef.current || [],
        [
          {
            range: new monaco.Range(line, 1, line, 1),
            options: {
              isWholeLine: true,
              className: lineClass,
              glyphMarginClassName: glyphMarginClass,
            },
          },
        ]
      );
    }
  }, [editor, monaco, line, lineClass]);

  return null;
};

export default LineDecoration;
