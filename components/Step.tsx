import { Monaco } from "@monaco-editor/react";
import Editor from "./Editor";
import React, { MutableRefObject, useRef, FC } from "react";
import { CustomKeyBinding, addKeyBinding } from "../utils/keyBindings";
import { ExplanationStep } from "../types";
import ContentWidget from "./ContentWidget";
import LineDecoration from "./LineDecoration";
import { useEventListener } from "@chakra-ui/hooks";
import classNames from "classnames";

export enum Mode {
  Edit = "Edit",
  View = "View",
}

interface StepNamespace {
  Mode: typeof Mode;
}

interface StepProps {
  step: ExplanationStep;
  steps: ExplanationStep[];
  mode: Mode;
  onPrev?: () => void;
  onNext?: () => void;
  onNew?: () => void;
  onMessageChange?: (message: string) => void;
  includeHighlights?: boolean;
}

const Step: FC<StepProps> & StepNamespace = ({
  mode = Mode.View,
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
        <div
          className={classNames(
            "w-72 relative",
            mode === Mode.View ? "evaluation-step-view" : "evaluation-step-edit"
          )}
        >
          <div className="absolute top-1 -right-2 arrow-right"></div>
          <div
            className="p-2 relative gradient-border"
            style={{ backgroundColor: "#161110" }}
          >
            {mode === Mode.View && <p className="my-2">{step.message}</p>}
            {mode === Mode.Edit && (
              <textarea
                key={step.id}
                ref={ref}
                defaultValue={step.message}
                onBlur={(e) => {
                  onMessageChange?.(e.currentTarget.value);
                }}
                className="p-1 box-border w-full bg-transparent border-none text-sm"
                placeholder="Choose some lines of code and explain them..."
              />
            )}
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
                {mode === Mode.Edit && (
                  <button
                    className="px-2 py-1 text-xs text-white transition gradient-cta bg-opacity-10 rounded-md focus:ring-2 focus:ring-white hover:bg-opacity-20 disabled:opacity-50"
                    onMouseUp={() => {
                      onNew?.();
                    }}
                  >
                    Add Step
                  </button>
                )}
              </div>
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

Step.Mode = Mode;

export default Step;
