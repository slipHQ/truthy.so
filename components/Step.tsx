import { Monaco } from "@monaco-editor/react";
import Editor from "./Editor";
import React, { MutableRefObject, ReactNode, FC } from "react";
import { CustomKeyBinding, addKeyBinding } from "../utils/keyBindings";
import LineHighlights from "./LineHighlights";
import { ExplanationStep } from "../types";
import ContentWidget from "./ContentWidget";

interface StepProps {
  step: ExplanationStep;
  onNext?: () => void;
}

const Step: FC<StepProps> = ({ step, onNext }) => {
  return (
    <>
      <ContentWidget widgetId={step.id} line={step.lines[0]}>
        <div className="w-56 bg-white bg-opacity-5 p-4 relative -left-80 gradient-border">
          {step.message}
          <div className="flex justify-end">
            <button
              onClick={() => {
                onNext?.();
              }}
            >
              Next
            </button>
          </div>
        </div>
      </ContentWidget>
      <LineHighlights lines={step.lines} />
    </>
  );
};

export default Step;
