import { supabase } from "../../utils/supabaseClient";
import Hashids from "hashids";
import { Quiz } from "../../types";
const hashids = new Hashids();
import React, { useEffect, useRef, useState } from "react";
import RunCodeEditor from "../../components/RunCodeEditor";
import { initScriptLoader } from "next/script";
import { createTSClient } from "@run-wasm/ts";
import Confetti, { ConfettiConfig } from 'react-dom-confetti';


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

  interface Console {
    // Note: use oldLog instead of log after loading TSClient!
    // See https://github.com/slipHQ/run-wasm/issues/101
    oldLog: (message?: any, ...optionalParams: any[]) => void;
  }
}

const tsScript =
  "https://unpkg.com/typescript@latest/lib/typescriptServices.js";

type PropTypes = {
  quiz: Quiz;
};

export default function ShowQuiz({ quiz }: PropTypes) {
  const [tsClient, setTsClient] = useState<any>(null);
  const codeRef = useRef(quiz.start_code);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<Array<string>>([]);
  const [errors, setErrors] = useState<Array<string>>([]);
  const [success, setSuccess] = useState(false);

  function initialiseTsClient() {
    const tsClient = createTSClient(window.ts);
    tsClient.fetchLibs(["es5", "dom"]).then(() => {
      setTsClient(tsClient);
    });
  }

  useEffect(() => {
    if (typeof window.ts === "undefined") {
      initScriptLoader([
        {
          src: tsScript,
          onLoad: initialiseTsClient,
        },
      ]);
    } else {
      initialiseTsClient();
    }
  }, []);

  const runCode = async () => {
    setIsLoading(true)
    setSuccess(false)
    const { output, errors }: { output: string[]; errors: string[] } =
      await tsClient.run({ code: codeRef.current });
    setOutput(output);
    setErrors(errors);
    if (errors.length == 0) {
      const lastOutput = output[output.length - 1];
      if (lastOutput == quiz.target_output) {
        setSuccess(true)
      }
    }
    setIsLoading(false)
  };

  // From https://daniel-lundin.github.io/react-dom-confetti/
  const confettiConfig: ConfettiConfig = {
    angle: 90,
    spread: 100,
    startVelocity: 34,
    elementCount: 81,
    dragFriction: 0.11,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  return (
    <>
      {/* <Script strategy="beforeInteractive" src={loadTSScript} /> */}
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <main className="mx-auto mb-12 max-w-7xl sm:mt-12">
            <div className="text-left">
              <p className="max-w-md mt-4 text-base text-gray-500 dark:text-gray-450 md:mx-auto sm:text-lg md:mt-16 md:text-xl md:max-w-3xl whitespace-pre-wrap">
                {quiz.description}
              </p>
            </div>
          </main>

          <div>
            <div className="mt-1 ">
              <div className="relative group">
                <div className="absolute -inset-0.5 dark:bg-gradient-to-r from-indigo-300 to-purple-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
                <RunCodeEditor codeRef={codeRef} runCode={runCode} />
              </div>
            </div>
          </div>

          <div className="pt-8 ">
              <div className="grid items-start justify-left">
                <div className="relative group">
                  <button
                    className="relative flex items-center py-4 leading-none bg-black divide-x divide-gray-600 rounded-lg px-7 border-gray-300 disabled:bg-gray-700 disabled:cursor-not-allowed"
                    onClick={runCode}
                    disabled={isLoading}
                  >
                    <Confetti active={ success } config={confettiConfig} />
                    <span className="text-gray-100 transition duration-200 group-hover:text-gray-100">
                      {!isLoading ? "Run Code →" : "Running..."}
                    </span>
                  </button>
                </div>
              </div>
          </div>

          {errors.length > 0 ? (
            <div>
              <label className="block pt-8 text-sm font-medium text-gray-700 dark:text-gray-450">
                Errors
              </label>
              {errors.map((error, index) => (
                <div key={index} className="mt-1">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div>
            <label className="block pt-8 text-sm font-medium text-gray-700 dark:text-gray-450">
              Output
            </label>

            <div className="mt-1 dark:text-gray-450">
              <pre>{output.join("\n")}</pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
