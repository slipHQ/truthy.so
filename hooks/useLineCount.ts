import { useEffect, useState } from "react";
import { useEditor } from "../components/Editor";

/**
 * Subscribe to and return line count of nearest Editor ancestor
 */
const useLineCount = (): number => {
  const editor = useEditor();
  const [count, setCount] = useState<number>(editor.getModel().getLineCount());

  useEffect(() => {
    const disposable = editor.onDidChangeModelContent(() => {
      setCount(editor.getModel().getLineCount());
    });
    return () => {
      disposable.dispose();
    };
  }, [editor]);

  return count;
};

export default useLineCount;
