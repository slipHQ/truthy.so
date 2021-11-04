import React, { useRef } from "react";
import Confetti from "react-dom-confetti";
import OutputEditor from "../components/OutputEditor";
import RunCodeEditor from "../components/RunCodeEditor";
import useRunCode from "../hooks/useRunCode";
import useTypescript from "../hooks/useTypescript";
import { confettiConfig } from "../utils/confettiConfig";
import Image from "next/image";
import Footer from "../components/Footer";
import { supabase } from "../utils/supabaseClient";
import { Quiz } from "../types";
import QuizTable from "../components/QuizTable";
import PageTitle from "../components/PageTitle";

export async function getServerSideProps({ params }) {
  const { data, error } = await supabase
    .from("quizzes")
    .select(
      "description, start_code, target_output, language, created_by, friendly_id, views"
    )
    .order("views", { ascending: false })
    .limit(10);

  if (error) throw error;

  return {
    props: {
      quizzes: data,
    },
  };
}

interface Props {
  quizzes: Quiz[];
}

export default function IndexPage({ quizzes }: Props) {
  const startCode = `const f = "fizz"
const b = "buzz"

// log fizzbuzz
console.log(f)`;
  const targetOutput = "fizzbuzz";

  const { tsClient, tsLoading } = useTypescript();
  const codeRef = useRef(startCode);
  const { runCode, codeRunning, output, hasCodeRun, success } = useRunCode(
    tsClient,
    codeRef,
    targetOutput
  );

  return (
    <>
      <main className='max-w-5xl mx-auto '>
        <div className='grid grid-cols-1 mt-12 ml-2 sm:mt-40 lg:grid-cols-7'>
          <div className='col-span-4 px-4 sm:px-8 xl:pr-16'>
            <h1 className='text-4xl font-extrabold tracking-tight text-gray-300 font-ibm sm:text-5xl md:text-6xl lg:text-5xl '>
              <span className='block '> Create and share</span>{" "}
              <span className='block text-purple-500 '>
                programming quizzes
              </span>
            </h1>
            <p className='max-w-md mx-auto mt-10 text-lg text-gray-300 lg:mt-4 sm:text-xl md:max-w-3xl'>
              Share free interactive programming quizzes with your audience!
              Test your friends knowledge of programming with our free quiz
              builder.
            </p>
            <div className='mt-10 lg:mt-8 sm:flex sm:justify-center lg:justify-start'>
              <div className='rounded-md shadow'>
                <a
                  href='/quizzes/create'
                  className='w-48 px-8 py-4 font-medium text-center text-white transition rounded-md gradient-cta hover:scale-105 disabled:hover:scale-100 disabled:opacity-50'
                >
                  Create a Quiz
                </a>
              </div>
            </div>
          </div>
          <div className='flex flex-col col-span-3 gap-4 px-1 mt-16 sm:mt-0'>
            <h3 className='text-white'>Try it out!</h3>
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
              className='w-32 py-2 text-sm font-medium text-white transition bg-black border border-gray-800 rounded-md margin-auto hover:scale-105 disabled:hover:scale-100 disabled:opacity-50'
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
      </main>

      <div className='max-w-4xl mx-4 mt-8 sm:mt-32 sm:mx-auto'>
        <h2 className='mb-10 text-3xl font-bold text-center text-white'>
          Popular Quizzes
        </h2>
        <QuizTable quizzes={quizzes} />
        <div className='mt-48'>
          <Footer />
        </div>
      </div>
    </>
  );
}
