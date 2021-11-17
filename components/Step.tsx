import { Monaco } from "@monaco-editor/react";
import Editor from "./Editor";
import React, { MutableRefObject, ReactNode, FC } from "react";
import { CustomKeyBinding, addKeyBinding } from "../utils/keyBindings";
import LineHighlights from "./LineHighlights";
import { ExplanationStep } from "../types";
import ContentWidget from "./ContentWidget";
import LineDecoration from "./LineDecoration";

interface StepProps {
  step: ExplanationStep;
  stepNumber: number;
  onPrev?: () => void;
  onNext?: () => void;
  onNew?: () => void;
  includeHighlights?: boolean;
}

const Step: FC<StepProps> = ({
  step,
  stepNumber,
  onPrev,
  onNext,
  onNew,
  includeHighlights = true,
}) => {
  return (
    <>
      <ContentWidget widgetId={step.id} line={step.lines[0]}>
        <div className="w-56 p-1 bg-white bg-opacity-5 relative -left-80 gradient-border">
          {step.message}
          <textarea
            className="box-border w-full bg-transparent border-none text-sm"
            placeholder="Describe the solution..."
          />
          <div className="flex justify-between p-1 text-xs items-center">
            <span>{stepNumber}</span>
            <div className="space-x-2">
              <button
                className="px-2 py-1 text-xs text-white transition bg-white bg-opacity-10 rounded-md focus:ring-2 focus:ring-white hover:bg-opacity-20 disabled:opacity-50"
                onClick={() => {
                  onPrev?.();
                }}
              >
                Prev
              </button>
              <button
                className="px-2 py-1 text-xs text-white transition bg-white bg-opacity-10 rounded-md focus:ring-2 focus:ring-white hover:bg-opacity-20 disabled:opacity-50"
                onClick={() => {
                  onNext?.();
                }}
              >
                Next
              </button>
              <button
                className="px-2 py-1 text-xs text-white transition gradient-cta bg-opacity-10 rounded-md focus:ring-2 focus:ring-white hover:bg-opacity-20 disabled:opacity-50"
                onClick={() => {
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
