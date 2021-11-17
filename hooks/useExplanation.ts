import { useState } from "react";
import { ExplanationStep } from "../types";
import { nanoid } from "nanoid";

const useExplanation = (
  defaultSteps: ExplanationStep[],
  defaultSelected: string | null = null
) => {
  const [selected, setSelected] = useState<string | null>(defaultSelected);
  const [steps, setSteps] = useState<ExplanationStep[]>(defaultSteps);

  const addStep = ({ index = steps.length } = {}) => {
    const id = nanoid();
    setSteps((prev) => {
      const copy = [...prev];
      copy.splice(index, 0, { id, message: "", lines: [] });
      return copy;
    });
    setSelected(id);
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  };

  const selectedStep = steps.find((step) => step.id === selected);

  const selectStep = (id: string) => {
    setSelected(id);
  };

  const selectedStepIndex = steps.findIndex((s) => s.id === selected);

  const selectNext = () => {
    const index = steps.findIndex((s) => s.id === selected);
    const nextIndex = (index + 1) % steps.length;
    setSelected(steps[nextIndex].id);
  };

  const selectPrev = () => {
    const index = steps.findIndex((s) => s.id === selected);
    const nextIndex = Math.max(index - 1, 0);
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
    selectedStepIndex,
    selectStep,
    selectPrev,
    selectNext,
    addStep,
    removeStep,
    udpateStep,
  };
};

export default useExplanation;
