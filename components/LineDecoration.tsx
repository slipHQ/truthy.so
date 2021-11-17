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

  useEffect(() => {
    if (editor && monaco) {
      // add decorations
      const delta = editor?.deltaDecorations(
        [],
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
      return () => {
        // dispose of decorations
        editor?.deltaDecorations(delta, []);
      };
    }
  }, [editor, monaco, line, lineClass]);

  useEffect(() => {
    editor?.render();
  });

  return null;
};

export default LineDecoration;
