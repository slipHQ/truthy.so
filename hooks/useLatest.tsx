import { useRef } from "react";

/**
 * Returns a ref that always points to the latest value it has been passed
 * during the most recent render of the hook's host component.
 */
const useLatest = <T extends any>(value: T): { readonly current: T } => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

export default useLatest;
