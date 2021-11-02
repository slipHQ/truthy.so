import Editor, { Monaco } from "@monaco-editor/react";
import React, { MutableRefObject } from "react";
import { CustomKeyBinding, addKeyBinding } from "../utils/keyBindings";

type PropTypes = {
  codeRef: MutableRefObject<string>;
  runCode: () => void;
  hasCodeRun: Boolean;
  output: Array<string>;
  height: string
};

export default function RunCodeEditor(props: PropTypes) {
  const { codeRef, runCode, hasCodeRun, output, height } = props;
  const editorRef = React.useRef(null);
  const [monaco, setMonaco] = React.useState<Monaco>(null);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
    setMonaco(monaco);
  }

  React.useEffect(() => {
    if (!monaco) {
      return;
    }
    const runCodeBinding: CustomKeyBinding = {
      label: "run",
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      callback: () => runCode(),
      editor: editorRef.current,
    };
    addKeyBinding(runCodeBinding);
  }, [monaco]);

  return (
    <div className={hasCodeRun && output.length === 0 ? "animate-shake" : null}>
      <Editor
        height={height}
        defaultLanguage="typescript"
        value={codeRef.current}
        onChange={(code: string) => {
          codeRef.current = code;
        }}
        className="block w-1/2 text-white bg-gray-900 border-gray-300 rounded-lg shadow-sm p-0.5 border dark:border-purple-300 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
        theme="vs-dark"
        options={{
          fontSize: 12,
          minimap: { enabled: false },
          overviewRulerLanes: 0,
          renderLineHighlight: "none",
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
