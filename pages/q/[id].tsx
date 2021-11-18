import { supabase } from "../../utils/supabaseClient";
import Hashids from "hashids";
import { Profile, Quiz } from "../../types";
const hashids = new Hashids();
import React, { useRef, useState } from "react";
import RunCodeEditor from "../../components/RunCodeEditor";
import { RefreshIcon } from "@heroicons/react/outline";
import Confetti from "react-dom-confetti";
import useTypescript from "../../hooks/useTypescript";
import useRunCode from "../../hooks/useRunCode";
import { confettiConfig } from "../../utils/confettiConfig";
import OutputEditor from "../../components/OutputEditor";
import Footer from "../../components/Footer";
import ViewCounter from "../../components/ViewCounter";
import useForceUpdate from "../../hooks/useForceUpdate";
import ContentWidget from "../../components/ContentWidget";
import Step from "../../components/Step";
import useExplanation from "../../hooks/useExplanation";

export async function getServerSideProps({ params }) {
  const id: string = params.id;
  const supabaseId = hashids.decode(id)[0];

  const { data, error } = await supabase
    .from("quizzes")
    .select(
      "description, start_code, target_output, language, created_by, id, solution, explanation"
    )
    .eq("id", supabaseId)
    .single();

  if (error) throw error;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, avatar_url, full_name")
    .eq("id", data.created_by);

  console.log(profile, profileError, data);

  if (error) throw profileError;

  return {
    props: {
      quiz: data,
      profile: profile[0],
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
  profile: Profile;
};

export default function ShowQuiz({ quiz, profile }: PropTypes) {
  const { tsClient, tsLoading } = useTypescript();
  const [showSolution, setShowSolution] = useState(false);
  const forceUpdate = useForceUpdate();
  let codeRef = useRef(quiz.start_code);
  let solutionCodeRef = useRef(quiz.solution);
  const userCodeInterpreter = useRunCode(tsClient, codeRef, quiz.target_output);
  const solutionInterpreter = useRunCode(
    tsClient,
    solutionCodeRef,
    quiz.target_output
  );
  const explanation = useExplanation(
    quiz.explanation?.steps || ([] as any),
    quiz.explanation?.steps[0]?.id
  );

  const activeInterpreter = showSolution
    ? solutionInterpreter
    : userCodeInterpreter;

  function resetCode() {
    codeRef.current = quiz.start_code;
    forceUpdate();
  }

  return (
    <>
      <div className="max-w-4xl pt-20 pb-48 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between px-4">
            <div className="flex flex-row">
              <img
                src={profile.avatar_url}
                alt="avatar"
                className="w-12 h-12 mr-4 rounded-full"
              />
              <div>
                <div>
                  <p className="font-bold text-white text-md">
                    {profile.full_name}
                  </p>
                  <a
                    className="text-sm font-bold text-gray-500"
                    href={`https://www.twitter.com/${profile.username}`}
                    target="_blank"
                  >
                    @{profile.username}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end mx-8 text-sm text-gray-500">
              <p className="text-gray-200">{ViewCounter(parseInt(quiz.id))}</p>
              {quiz.language}
            </div>
          </div>
          <p className="max-w-md px-4 mx-auto mt-4 mb-12 text-base text-left text-white whitespace-pre-wrap sm:mt-12 md:mx-auto sm:text-lg md:mt-16 md:text-xl md:max-w-3xl">
            {quiz.description}
          </p>
          <div className="flex justify-end mt-16 pt-18">
            {!showSolution && (
              <button
                type="button"
                className="px-2 py-2 text-xs font-medium text-center text-white transition bg-black bg-opacity-25 border-l border-gray-800 border-tl ml-2w-48 rounded-tl-md margin-auto hover:bg-gray-900"
                onClick={resetCode}
                title="Reset Code"
              >
                <RefreshIcon className="w-4 h-4" />
              </button>
            )}
            {quiz.solution && (
              <button
                type="button"
                className="px-2 py-2 text-xs font-medium text-center text-white transition bg-black bg-opacity-25 border-r border-gray-800 border-tr ml-2w-48 rounded-tr-md margin-auto hover:bg-gray-900"
                onClick={() => setShowSolution((prev) => !prev)}
              >
                {showSolution ? (
                  <span>Hide Solution</span>
                ) : (
                  <span>Show Solution</span>
                )}
              </button>
            )}
          </div>

          {showSolution && (
            <RunCodeEditor
              codeRef={solutionCodeRef}
              runCode={solutionInterpreter.runCode}
              hasCodeRun={solutionInterpreter.hasCodeRun}
              output={solutionInterpreter.output}
              height="20rem"
              readOnly
            >
              {explanation.selected.step && (
                <Step
                  step={explanation.selected.step}
                  steps={explanation.steps}
                  mode={Step.Mode.View}
                  onPrev={() => explanation.selectPrev()}
                  onNext={() => explanation.selectNext()}
                />
              )}
            </RunCodeEditor>
          )}
          {!showSolution && (
            <RunCodeEditor
              codeRef={codeRef}
              runCode={userCodeInterpreter.runCode}
              hasCodeRun={userCodeInterpreter.hasCodeRun}
              output={userCodeInterpreter.output}
              height="20rem"
            />
          )}
          <div className="px-4 pt-8 sm:px-0">
            <button
              className="relative flex items-center px-4 py-2 text-sm font-medium text-white transition rounded-md font-ibm gradient-cta hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
              onClick={activeInterpreter.runCode}
              disabled={activeInterpreter.codeRunning || tsLoading}
            >
              <Confetti
                active={activeInterpreter.success}
                config={confettiConfig}
              />
              <span className="text-gray-100 transition duration-200 group-hover:text-gray-100">
                {tsLoading || activeInterpreter.codeRunning
                  ? "Loading..."
                  : "Run Code →"}
              </span>
            </button>
          </div>

          {activeInterpreter.errors.length && (
            <div>
              <label className="block pt-8 pb-2 text-sm font-medium text-white">
                Errors
              </label>
              <div className="p-4 bg-gray-300 rounded-md bg-opacity-20 max-w-max lg:bg-transparent">
                {activeInterpreter.errors.map((error, index) => (
                  <div key={index}>
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block pt-8 pb-2 text-sm font-medium text-white">
              Output
            </label>

            <OutputEditor output={activeInterpreter.output} height="10rem" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
