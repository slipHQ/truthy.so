import MonacoEditor, { Monaco, EditorProps } from "@monaco-editor/react";
import React, { FC, useState, createContext, useContext } from "react";
import * as m from "monaco-editor/esm/vs/editor/editor.api";

const EditorContext = createContext<m.editor.IStandaloneCodeEditor | null>(
  null
);

const Editor: FC<EditorProps> = ({ onMount, children, ...otherProps }) => {
  const [editor, setEditor] = useState<m.editor.IStandaloneCodeEditor | null>(
    null
  );

  function handleMount(editor: any, monaco: Monaco) {
    setEditor(editor);
    onMount(editor, monaco);
  }

  return (
    <EditorContext.Provider value={editor}>
      <MonacoEditor {...otherProps} onMount={handleMount}></MonacoEditor>
      {editor && children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const editor = useContext(EditorContext);
  if (!editor) {
    throw new Error("useEditor may only be used within an Editor");
  }
  return editor;
};

export default Editor;
