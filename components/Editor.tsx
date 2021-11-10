import MonacoEditor, { Monaco, EditorProps } from "@monaco-editor/react";
import React, { FC, useState, createContext, useContext } from "react";

const EditorContext = createContext(null);

const Editor: FC<EditorProps> = ({ onMount, children, ...otherProps }) => {
  const [editor, setEditor] = useState(null);

  function handleMount(editor: any, monaco: Monaco) {
    setEditor(editor);
    onMount(editor, monaco);
  }

  return (
    <EditorContext.Provider value={editor}>
      <MonacoEditor {...otherProps} onMount={handleMount}></MonacoEditor>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  return useContext(EditorContext);
};

export default Editor;
