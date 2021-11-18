import Editor from "@monaco-editor/react";
import React from "react";

type PropTypes = {
  output: Array<string>;
  height: string;
};

export default function OutputEditor(props: PropTypes) {
  const { output, height } = props;

  return (
    <Editor
      height={height}
      defaultLanguage="typescript"
      value={output.join("\n")}
      className="block w-1/2 text-white rounded-lg shadow-sm opacity-75 sm:text-sm"
      theme="vs-dark"
      options={{
        fontSize: 12,
        padding: { top: 15, bottom: 4 },
        minimap: { enabled: false },
        readOnly: true,
        lineNumbers: "off",
        overviewRulerLanes: 0,
        renderLineHighlight: "none",
      }}
    />
  );
}
