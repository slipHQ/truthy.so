import Editor from "@monaco-editor/react";
import React from "react";

type PropTypes = {
  output: Array<string>;
  height: string;
};

export default function OutputEditor(props: PropTypes) {
  const { output, height } = props

  return (
    <Editor
      height={height}
      defaultLanguage="typescript"
      value={output.join("\n")}
      className="block w-1/2 text-white bg-gray-900 border-gray-300 rounded-lg shadow-sm p-0.5 border focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
      theme="vs-dark"
      options={{
        fontSize: 12,
        minimap: { enabled: false },
        readOnly: true,
        lineNumbers: "off",
        overviewRulerLanes: 0,
        renderLineHighlight: "none",
      }}
    />
  );
}
