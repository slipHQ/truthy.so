import React, { FormEvent, useRef, useState } from "react";
import Hashids from "hashids";
import { Session } from "@supabase/supabase-js";
import Confetti from "react-dom-confetti";
import useRunCode from "../hooks/useRunCode";
import { ExplanationStep, SaveQuiz } from "../types";
import useTypescript from "../hooks/useTypescript";
import { Profile, Quiz } from "../types";
import { confettiConfig } from "../utils/confettiConfig";
import OutputEditor from "./OutputEditor";
import RunCodeEditor from "./RunCodeEditor";
import { supabase } from "../utils/supabaseClient";
import { nanoid } from "nanoid";

const hashids = new Hashids();

const useExplanation = (defaultSteps: ExplanationStep[]) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [steps, setSteps] = useState<ExplanationStep[]>(defaultSteps);

  const addStep = () => {
    setSteps((prev) => [...prev, { id: nanoid(), message: "", lines: [] }]);
  };

  const removeStep = (id) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  };

  const selectedStep = steps.find((step) => step.id === selectedStep);

  const selectStep = (id) => {
    setSelected(id);
  };

  return {
    steps,
    selectedStep,
    selectStep,
    addStep,
    removeStep,
  };
};

declare global {
  interface Window {
    ts: any;
  }
}

type PropTypes = {
  quiz: Quiz;
  profile: Profile;
  session: Session;
};

export default function ShowQuiz({ quiz, profile, session }: PropTypes) {
  const { tsClient, tsLoading } = useTypescript();
  const codeRef = useRef(quiz.start_code);
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState(null);
  const explanation = useExplanation([]);

  const { runCode, codeRunning, output, errors, hasCodeRun, success } =
    useRunCode(tsClient, codeRef, quiz.target_output);

  async function saveQuiz() {
    setLoading(true);

    const now = new Date();
    const insertQuiz: SaveQuiz = {
      ...quiz,
      solution: codeRef.current,
      created_at: now,
      updated_at: now,
      created_by: session.user.id,
    };

    // Insert the quiz without a friendly ID
    // Note that friendly ID isn't required, it's just helpful for debugging
    const { data: insertData, error: insertError } = await supabase
      .from("quizzes")
      .insert(insertQuiz);
    setLoading(false);
    if (insertError) throw insertError;

    // Generate the friendly (hashed) ID for the created quiz
    const insertedId = insertData[0].id;
    const hashedId = hashids.encode(insertedId);

    const url = `${process.env.NEXT_PUBLIC_HOME_URL}/q/${hashedId}`;
    setCreatedUrl(url);

    // Update the quiz to include the friendly ID
    await supabase
      .from("quizzes")
      .update({ friendly_id: hashedId })
      .eq("id", insertedId);
  }

  return (
    <>
      <div className="max-w-4xl pt-20 mx-auto sm:px-6 lg:px-8">
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
              <p className="text-gray-200">1337 views</p>
              {quiz.language}
            </div>
          </div>
          <p className="max-w-md px-4 mx-auto mt-4 mb-12 text-base text-left text-white whitespace-pre-wrap sm:mt-12 md:mx-auto sm:text-lg md:mt-16 md:text-xl md:max-w-3xl">
            {quiz.description}
          </p>

          <RunCodeEditor
            codeRef={codeRef}
            runCode={runCode}
            hasCodeRun={hasCodeRun}
            output={output}
            height="20rem"
          />

          <div className="px-4 pt-8 sm:px-0">
            <button
              className="relative flex items-center px-4 py-2 text-sm font-medium text-white transition rounded-md font-ibm gradient-cta hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
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
              <div className="p-4 bg-gray-300 rounded-md bg-opacity-20 max-w-max lg:bg-transparent">
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
          <div>
            <div className="flex justify-between items-center h-8 mt-8 mb-2">
              <label className="block pt-2 pb-2 text-sm font-medium text-white">
                Explanation of Solution
              </label>
              <button
                onClick={() => explanation.addStep()}
                className="relative flex items-center px-4  text-sm font-medium text-white transition rounded-md font-ibm gradient-cta hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 h-8"
              >
                Add Step
              </button>
            </div>
            <div>
              {explanation.steps.length === 0 && (
                <p className="text-white text-sm opacity-60 my-4">
                  No steps yet, but explanation is optional.
                </p>
              )}
              {explanation.steps.map((step, i) => (
                <div
                  key={step.id}
                  tabIndex={0}
                  onClick={() => explanation.selectStep(step.id)}
                >
                  <label
                    htmlFor={step.id}
                    className="block pt-2 pb-2 text-sm font-medium text-white"
                  >
                    <p>Step {i + 1}</p>
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 block w-full py-4 text-white bg-gray-600 bg-opacity-25 border-0 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm rounded-xl"
                      value={step.message}
                      placeholder="Explanation"
                    />
                    <div className="w-4" />
                    <input
                      type="text"
                      className="w-40 block w-full py-4 text-white bg-gray-600 bg-opacity-25 border-0 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm rounded-xl"
                      value={step.lines.toString()}
                      placeholder="Line Numbers"
                    />
                    <div className="w-4" />
                    <button
                      className="relative flex items-center px-4  text-sm font-medium text-white rounded-xl font-ibm h-100 bg-gray-600 bg-opacity-25 hover:bg-opacity-40"
                      onClick={() => explanation.removeStep(step.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="justify-end pt-5 mt-6 right-64">
        <div className="flex items-center justify-end space-x-4">
          <button
            type="submit"
            className="px-20 py-4 font-medium text-white transition gradient-cta rounded-xl focus:ring-2 focus:ring-white hover:scale-105 disabled:opacity-50"
            disabled={!success}
            onClick={saveQuiz}
          >
            Save
          </button>
        </div>
      </div>
      {createdUrl ? (
        <span className="text-lg text-white">
          Quiz created successfully!{" "}
          <a className="font-medium underline" href={createdUrl}>
            {createdUrl}
          </a>
        </span>
      ) : (
        <span />
      )}
    </>
  );
}
