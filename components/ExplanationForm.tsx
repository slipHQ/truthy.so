import React, { FormEvent, useEffect, useRef, useState } from "react";
import Hashids from "hashids";
import { Session } from "@supabase/supabase-js";
import Confetti from "react-dom-confetti";
import useRunCode from "../hooks/useRunCode";
import { Explanation, ExplanationStep, SaveQuiz } from "../types";
import useTypescript from "../hooks/useTypescript";
import { Profile, Quiz } from "../types";
import { confettiConfig } from "../utils/confettiConfig";
import OutputEditor from "./OutputEditor";
import RunCodeEditor from "./RunCodeEditor";
import { supabase } from "../utils/supabaseClient";
import { nanoid } from "nanoid";
import { NumberArrayInput } from "./ComplexInput";
import Step from "./Step";
import useExplanation from "../hooks/useExplanation";
import LineSelector from "./LineSelector";
import Editor from "./Editor";

type PropTypes = {
  solution: string;
  onChange?: (explanation: Explanation) => void;
};

export default function ExplanationForm({ onChange, solution }: PropTypes) {
  const explanation = useExplanation([]);

  useEffect(() => {
    onChange?.({
      steps: explanation.steps,
    });
  }, [explanation.steps]);

  return (
    <>
      <div className="max-w-4xl pt-20 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Editor
            height={300}
            defaultLanguage="typescript"
            value={solution}
            className="block text-white rounded-lg dark:border-purple-300 focus:ring-gray-500 sm:text-sm"
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              overviewRulerLanes: 0,
              padding: { top: 15, bottom: 4 },
              renderLineHighlight: "none",
              readOnly: true,
              glyphMargin: true,
            }}
          >
            {explanation.selected.step && (
              <>
                <LineSelector
                  lines={explanation.selected.step?.lines}
                  onChange={(lines) => {
                    explanation.udpateStep(explanation.selected.step.id, {
                      lines: lines.sort(),
                    });
                  }}
                />
                <Step
                  step={explanation.selected.step}
                  steps={explanation.steps}
                  mode={Step.Mode.Edit}
                  onPrev={() => explanation.selectPrev()}
                  onNext={() => explanation.selectNext()}
                  onNew={() => {
                    explanation.addStep({
                      index: explanation.selected.index + 1,
                    });
                  }}
                  onMessageChange={(message) => {
                    explanation.udpateStep(explanation.selected.step.id, {
                      message,
                    });
                  }}
                  includeHighlights={false}
                />
              </>
            )}
          </Editor>
          <div className="flex justify-between items-center h-8 mt-8 mb-4">
            {explanation.steps.length === 0 && (
              <button
                onClick={() => explanation.addStep()}
                className="relative flex items-center px-4  text-sm font-medium text-white transition rounded-md font-ibm gradient-cta hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 h-8"
              >
                Begin Explanation
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
