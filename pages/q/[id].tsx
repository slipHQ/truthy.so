import { supabase } from "../../utils/supabaseClient";
import Hashids from "hashids";
import { Quiz } from "../../types";
const hashids = new Hashids();
import React, { useRef } from "react";
import RunCodeEditor from "../../components/RunCodeEditor";
import Confetti from "react-dom-confetti";
import useTypescript from "../../hooks/useTypescript";
import useRunCode from "../../hooks/useRunCode";
import { confettiConfig } from "../../utils/confettiConfig";
import OutputEditor from "../../components/OutputEditor";

export async function getServerSideProps({ params }) {
  const id: string = params.id;
  const supabaseId = hashids.decode(id)[0];

  const { data, error } = await supabase
    .from("quizzes")
    .select("description, start_code, target_output, language")
    .eq("id", supabaseId)
    .single();

  if (error) throw error;

  return {
    props: {
      quiz: data,
    },
  };
}

declare global {
  interface Window {
    ts: any;
  }
}

type PropTypes = {
  quiz: Quiz;
};

export default function ShowQuiz({ quiz }: PropTypes) {
  const { tsClient, tsLoading } = useTypescript();
  const codeRef = useRef(quiz.start_code);
  const { runCode, codeRunning, output, errors, hasCodeRun, success } =
    useRunCode(tsClient, codeRef, quiz.target_output);

  return (
    <>
      <div className="max-w-4xl px-4 py-20 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="mx-auto mb-12 sm:mt-12 text-left max-w-md mt-4 text-base text-white md:mx-auto sm:text-lg md:mt-16 md:text-xl md:max-w-3xl whitespace-pre-wrap">
            {quiz.description}
          </p>

          <RunCodeEditor
            codeRef={codeRef}
            runCode={runCode}
            hasCodeRun={hasCodeRun}
            output={output}
            height="20rem"
          />

          <div className="pt-8 ">
            <button
              className="gradient-cta rounded-xl relative flex items-center py-4 px-8 font-medium text-white hover:scale-105 disabled:hover:scale-100 transition disabled:opacity-50"
              onClick={runCode}
              disabled={codeRunning || tsLoading}
            >
              <Confetti active={success} config={confettiConfig} />
              <span className="text-gray-100 transition duration-200 group-hover:text-gray-100">
                {tsLoading || codeRunning ? "Loading..." : "Run Code →"}
              </span>
            </button>
          </div>

          {errors.length > 0 ? (
            <div>
              <label className="block pt-8 pb-2 text-sm font-medium text-white">
                Errors
              </label>
              <div className="bg-gray-300 bg-opacity-20 max-w-max lg:bg-transparent p-4 rounded-md">
                {errors.map((error, index) => (
                  <div key={index}>
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <label className="block pt-8 pb-2 text-sm font-medium text-white">
              Output
            </label>

            <OutputEditor output={output} height="10rem" />
          </div>
        </div>
      </div>
    </>
  );
}
