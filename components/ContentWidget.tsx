import { useLayoutEffect, useRef, FC, ReactNode } from "react";
import { useMonaco } from "@monaco-editor/react";
import { useEditor } from "./Editor";
import ReactDOM from "react-dom";

interface ContentWidgetProps {
  children: any;
  line: number;
  widgetId: string;
}

const ContentWidget: FC<ContentWidgetProps> = ({
  widgetId,
  line,
  children,
}) => {
  const monaco = useMonaco();
  const editor = useEditor();

  useLayoutEffect(() => {
    if (editor) {
      // Add a content widget (scrolls inline with text)
      var contentWidget = {
        domNode: null,
        allowEditorOverflow: true,
        getId: function () {
          return widgetId;
        },
        getDomNode: function () {
          if (!this.domNode) {
            this.domNode = document.createElement("div");
            this.domNode.style.position = "relative";
            this.domNode.style.width = 0;
          }
          return this.domNode;
        },
        afterRender: function () {
          ReactDOM.render(children, this.domNode);
        },
        getPosition: function () {
          return {
            position: {
              lineNumber: line,
              column: 0,
            },
            preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE],
          };
        },
      };
      editor.addContentWidget(contentWidget);
      return () => {
        editor.removeContentWidget(contentWidget);
      };
    }
  }, [editor, children]);

  return null;
};

export default ContentWidget;
