import { useCallback, useState } from "react";

type Updater = () => void;

/**
 * Kind of an escape hatch, but useful when you update values that are not stored in react state
 * and you want to forcibly rerender a component to recognize the updated value.
 */
const useForceUpdate = (): Updater => {
  const [_, setCount] = useState(0);

  return useCallback(() => {
    setCount((prev) => prev + 1);
  }, [setCount]);
};

export default useForceUpdate;
