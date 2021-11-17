import {
  useLayoutEffect,
  useRef,
  FC,
  ReactNode,
  useEffect,
  Children,
} from "react";
import { useMonaco } from "@monaco-editor/react";
import { useEditor } from "./Editor";
import ReactDOM from "react-dom";
import useForceUpdate from "../hooks/useForceUpdate";

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
  const ref = useRef(null);
  const forceUdpate = useForceUpdate();

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
          if (!ref.current) {
            ref.current = document.createElement("div");
            ref.current.style.position = "relative";
            ref.current.style.width = 0;
            ref.current.classList.add("content-widget-portal");
          }
          return ref.current;
        },
        afterRender: function () {
          ReactDOM.render(
            <Test>
              <div
                onMouseOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {children}
              </div>
            </Test>,
            ref.current
          );
        },
        getPosition: function () {
          return {
            position: {
              lineNumber: line,
              column: 0,
            },
            preference: [monaco.editor.ContentWidgetPositionPreference.EXACT],
          };
        },
      };
      editor.addContentWidget(contentWidget);
      return () => {
        editor.removeContentWidget(contentWidget);
      };
    }
  }, [editor, children, forceUdpate]);

  if (!ref.current) return null;

  return null;
};

export default ContentWidget;

const Test = ({ children }) => {
  useEffect(() => {
    console.info("mounting");
    return () => {
      console.info("unmounting");
    };
  }, []);
  return children;
};
