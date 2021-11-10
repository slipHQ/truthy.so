import { useCallback, useState } from "react";

type Updater = () => void;

const useForceUpdate = (): Updater => {
  const [_, setCount] = useState(0);

  return useCallback(() => {
    setCount((prev) => prev + 1);
  }, [setCount]);
};

export default useForceUpdate;
