import React, { useRef } from "react";
import Confetti from "react-dom-confetti";
import OutputEditor from "../components/OutputEditor";
import RunCodeEditor from "../components/RunCodeEditor";
import useRunCode from "../hooks/useRunCode";
import useTypescript from "../hooks/useTypescript";
import { confettiConfig } from "../utils/confettiConfig";

export default function IndexPage() {
  const startCode = `const f = "fizz"
const b = "buzz"

// log fizzbuzz
console.log(f)`;
  const targetOutput = "fizzbuzz";

  const { tsClient, tsLoading } = useTypescript();
  const codeRef = useRef(startCode);
  const { runCode, codeRunning, output, hasCodeRun, success } =
    useRunCode(tsClient, codeRef, targetOutput);

  return (
    <div className="m-auto max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 ml-2 mt-40">
        <div className="flex flex-col gap-16 col-span-3">
          <h1 className="font-mono text-4xl text-white font-medium">
            Create and share programming quizzes
          </h1>
          <h2 className="font-mono text-xl text-white font-medium">
            Share free interactive programming quizzes with your audience!
          </h2>
          <a href="/quizzes/create" className="gradient-cta rounded-xl w-48 py-4 px-8 font-medium text-center text-white hover:scale-105 disabled:hover:scale-100 transition disabled:opacity-50">Create a Quiz</a>
        </div>
        <div className="flex flex-col gap-4 col-span-2">
          <h3 className="text-white">Quiz</h3>
          <p className="text-sm text-white">Complete the quiz below! 🎉</p>
          <RunCodeEditor
            codeRef={codeRef}
            runCode={runCode}
            hasCodeRun={hasCodeRun}
            output={output}
            height="10rem"
          />

          <div>
            <label className="block pt-8 pb-8 text-sm font-medium text-white">
              Output
            </label>

            <OutputEditor output={output} height="2rem" />
          </div>

          <button
            className="bg-gray-900 rounded-xl py-4 margin-auto w-32 font-medium text-white hover:scale-105 disabled:hover:scale-100 transition disabled:opacity-50"
            onClick={runCode}
            disabled={codeRunning || tsLoading}
          >
            <Confetti active={success} config={confettiConfig} />
            <span className="text-gray-100 transition duration-200 group-hover:text-gray-100">
              {tsLoading || codeRunning ? "Loading..." : "Run Code →"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
