import { Monaco } from "@monaco-editor/react";
import Editor from "./Editor";
import React, { MutableRefObject, useRef, FC } from "react";
import { CustomKeyBinding, addKeyBinding } from "../utils/keyBindings";
import LineHighlights from "./LineHighlights";
import { ExplanationStep } from "../types";
import ContentWidget from "./ContentWidget";
import LineDecoration from "./LineDecoration";
import { useEventListener } from "@chakra-ui/hooks";

interface StepProps {
  step: ExplanationStep;
  steps: ExplanationStep[];
  onPrev?: () => void;
  onNext?: () => void;
  onNew?: () => void;
  onMessageChange?: (message: string) => void;
  includeHighlights?: boolean;
}

const Step: FC<StepProps> = ({
  step,
  steps,
  onPrev,
  onNext,
  onNew,
  onMessageChange,
  includeHighlights = true,
}) => {
  const index = steps.findIndex((s) => step.id === s.id);
  const ref = useRef(null);

  return (
    <>
      <ContentWidget widgetId={step.id} line={step.lines[0]}>
        <div className="w-72 p-2 bg-white bg-opacity-5 relative gradient-border evaluation-step">
          {/* {step.message} */}
          <textarea
            key={step.id}
            ref={ref}
            defaultValue={step.message}
            onBlur={(e) => {
              onMessageChange?.(e.currentTarget.value);
            }}
            className="p-1 box-border w-full bg-transparent border-none text-sm"
            placeholder="Describe the solution..."
          />
          <div className="flex justify-between p-0 text-xs items-center">
            <span>
              {index + 1} of {steps.length}
            </span>
            <div className="space-x-2">
              <button
                className="px-2 py-1 text-xs text-white transition bg-white bg-opacity-10 rounded-md focus:ring-2 focus:ring-white hover:bg-opacity-20 disabled:opacity-50"
                onMouseUp={() => {
                  onPrev?.();
                }}
                disabled={index === 0}
              >
                Prev
              </button>
              <button
                className="px-2 py-1 text-xs text-white transition bg-white bg-opacity-10 rounded-md focus:ring-2 focus:ring-white hover:bg-opacity-20 disabled:opacity-50"
                onMouseUp={() => {
                  onNext?.();
                }}
                disabled={index === steps.length - 1}
              >
                Next
              </button>
              <button
                className="px-2 py-1 text-xs text-white transition gradient-cta bg-opacity-10 rounded-md focus:ring-2 focus:ring-white hover:bg-opacity-20 disabled:opacity-50"
                onMouseUp={() => {
                  onNew?.();
                }}
              >
                Add Step
              </button>
            </div>
          </div>
        </div>
      </ContentWidget>
      {includeHighlights &&
        step.lines.map((line) => (
          <LineDecoration
            key={line} // need a way to identify lines
            line={line}
            lineClass="editor-highlight-line"
          />
        ))}
    </>
  );
};

export default Step;
