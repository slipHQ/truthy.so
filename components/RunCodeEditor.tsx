import Editor, { Monaco } from "@monaco-editor/react";
import React, { MutableRefObject } from "react";
import { CustomKeyBinding, addKeyBinding } from "../utils/keyBindings";

type PropTypes = {
  codeRef: MutableRefObject<string>;
  runCode: () => void;
  hasCodeRun: Boolean;
  output: Array<string>;
  height: string;
  readOnly?: boolean;
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
  }, [monaco, runCode]);

  return (
    <div className={hasCodeRun && output.length === 0 ? "animate-shake" : null}>
      <Editor
        height={height}
        defaultLanguage="typescript"
        value={codeRef.current}
        onChange={(code: string) => {
          codeRef.current = code;
        }}
        className="block text-white rounded-lg dark:border-purple-300 focus:ring-gray-500 sm:text-sm"
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          overviewRulerLanes: 0,
          padding: { top: 15, bottom: 4, left: 4, right: 4 },
          renderLineHighlight: "none",
          readOnly: props.readOnly,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
