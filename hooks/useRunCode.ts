import { useState } from "react";

export default function useRunCode(
  tsClient: any,
  codeRef: React.MutableRefObject<string>,
  targetOutput: string
) {
  const [codeRunning, setCodeRunning] = useState(false);
  const [output, setOutput] = useState<Array<string>>([]);
  const [errors, setErrors] = useState<Array<string>>([]);
  const [hasCodeRun, setHasCodeRun] = useState(false);
  const [success, setSuccess] = useState(false);

  const runCode = async () => {
    if (!tsClient) return;

    setHasCodeRun(false);
    setCodeRunning(true);
    setSuccess(false);

    const { output, errors }: { output: string[]; errors: string[] } =
      await tsClient.run({ code: codeRef.current });
    setOutput(output);
    setErrors(errors);
    if (errors.length == 0) {
      const lastOutput = output[output.length - 1];
      if (lastOutput == targetOutput) {
        setSuccess(true);
      }
    }
    setCodeRunning(false);
    setHasCodeRun(true);
  };

  return {
    runCode,
    codeRunning,
    output,
    errors,
    hasCodeRun,
    success
  }
}
