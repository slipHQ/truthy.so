import React, { useRef } from "react";
import Confetti from "react-dom-confetti";
import OutputEditor from "../components/OutputEditor";
import RunCodeEditor from "../components/RunCodeEditor";
import useRunCode from "../hooks/useRunCode";
import useTypescript from "../hooks/useTypescript";
import { confettiConfig } from "../utils/confettiConfig";
import Image from 'next/image'

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
    <div className='max-w-5xl mx-auto'>
      <div className='grid grid-cols-1 gap-16 mt-40 ml-2 lg:grid-cols-6'>
        <div className='flex flex-col col-span-3 gap-16'>
          <h1 className='text-4xl font-medium text-white font-ibm'>
            Create and share programming quizzes
          </h1>
          <h2 className='text-xl font-medium text-white font-ibm'>
            Share free interactive programming quizzes with your audience!
          </h2>
          <a
            href='/quizzes/create'
            className='w-48 px-8 py-4 font-medium text-center text-white transition gradient-cta rounded-xl hover:scale-105 disabled:hover:scale-100 disabled:opacity-50'
          >
            Create a Quiz
          </a>
        </div>
        <div className='flex flex-col col-span-3 gap-4'>
          <h3 className='text-white'>Quiz</h3>
          <p className='text-sm text-white'>Complete the quiz below! 🎉</p>
          <RunCodeEditor
            codeRef={codeRef}
            runCode={runCode}
            hasCodeRun={hasCodeRun}
            output={output}
            height='10rem'
          />
          {hasCodeRun ? (
            <div>
              <label className='block pt-8 pb-8 text-sm font-medium text-white'>
                Output
              </label>

              <OutputEditor output={output} height='8rem' />
            </div>
          ) : null}

          <button
            className='w-32 py-3 font-medium text-white transition bg-black border border-gray-800 rounded-xl margin-auto hover:scale-105 disabled:hover:scale-100 disabled:opacity-50'
            onClick={runCode}
            disabled={codeRunning || tsLoading}
          >
            <Confetti active={success} config={confettiConfig} />
            <span className='text-gray-100 transition duration-200 group-hover:text-gray-100'>
              {tsLoading || codeRunning ? "Loading..." : "Run Code →"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
