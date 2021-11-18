import { useState } from "react";
import { ExplanationStep } from "../types";
import { nanoid } from "nanoid";

/**
 * Handles all of the logic related to explanation state
 */
const useExplanation = (
  defaultSteps: ExplanationStep[],
  defaultSelectedId: string | null = null
) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    defaultSelectedId
  );
  const [steps, setSteps] = useState<ExplanationStep[]>(defaultSteps);

  const addStep = ({ index = steps.length } = {}) => {
    const id = nanoid();
    setSteps((prev) => {
      const copy = [...prev];
      copy.splice(index, 0, { id, message: "", lines: [] });
      return copy;
    });
    setSelectedId(id);
  };

  const removeStepById = (id: string) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  };

  const selected = {
    step: steps.find((step) => step.id === selectedId),
    index: steps.findIndex((s) => s.id === selectedId),
  };

  const selectStepById = (id: string) => {
    setSelectedId(id);
  };

  const selectNext = () => {
    const index = steps.findIndex((s) => s.id === selectedId);
    const nextIndex = (index + 1) % steps.length;
    setSelectedId(steps[nextIndex].id);
  };

  const selectPrev = () => {
    const index = steps.findIndex((s) => s.id === selectedId);
    const nextIndex = Math.max(index - 1, 0);
    setSelectedId(steps[nextIndex].id);
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
    selected,
    selectStepById,
    selectPrev,
    selectNext,
    addStep,
    removeStepById,
    udpateStep,
  };
};

export default useExplanation;
