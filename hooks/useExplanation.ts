import { useState } from "react";
import { ExplanationStep } from "../types";
import { nanoid } from "nanoid";

const useExplanation = (
  defaultSteps: ExplanationStep[],
  defaultSelected: string | null = null
) => {
  const [selected, setSelected] = useState<string | null>(defaultSelected);
  const [steps, setSteps] = useState<ExplanationStep[]>(defaultSteps);

  const addStep = () => {
    setSteps((prev) => [...prev, { id: nanoid(), message: "", lines: [] }]);
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  };

  const selectedStep = steps.find((step) => step.id === selected);

  const selectStep = (id: string) => {
    setSelected(id);
  };

  const selectNext = () => {
    const index = steps.findIndex((s) => s.id === selected);
    const nextIndex = (index + 1) % steps.length;
    setSelected(steps[nextIndex].id);
  };

  const udpateStep = (id, patch: Partial<ExplanationStep>) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id !== id) {
          return step;
        } else {
          return {
            ...step,
            ...patch,
          };
        }
      })
    );
  };

  return {
    steps,
    selectedStep,
    selectStep,
    selectNext,
    addStep,
    removeStep,
    udpateStep,
  };
};

export default useExplanation;
