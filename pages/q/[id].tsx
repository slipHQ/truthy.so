import { supabase } from "../../utils/supabaseClient";
import Hashids from "hashids";
import { Quiz } from "../../types";
const hashids = new Hashids();
import React, { useEffect, useRef, useState } from "react";
import RunCodeEditor from "../../components/RunCodeEditor";
import { initScriptLoader } from "next/script";
import { createTSClient } from "@run-wasm/ts";
import Confetti, { ConfettiConfig } from 'react-dom-confetti';
import Editor from "@monaco-editor/react";


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
  const [isLoading, setIsLoading] = useState(true);
  const [output, setOutput] = useState<Array<string>>([]);
  const [errors, setErrors] = useState<Array<string>>([]);
  const [hasCodeRun, setHasCodeRun] = useState(false);
  const [success, setSuccess] = useState(false);

  function initialiseTsClient() {
    const tsClient = createTSClient(window.ts);
    tsClient.fetchLibs(["es5", "dom"]).then(() => {
      setTsClient(tsClient);
      setIsLoading(false);
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
    setHasCodeRun(false)
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
    setHasCodeRun(true)
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
              <p className="max-w-md mt-4 text-base text-white md:mx-auto sm:text-lg md:mt-16 md:text-xl md:max-w-3xl whitespace-pre-wrap">
                {quiz.description}
              </p>
            </div>
          </main>

          <div>
            <div className= { hasCodeRun && output.length === 0 ? 'animate-shake' : null }>
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
                    className="gradient-cta rounded-xl relative flex items-center py-4 px-8 font-medium text-white hover:scale-105 disabled:hover:scale-100 transition disabled:opacity-50"
                    onClick={runCode}
                    disabled={isLoading}
                  >
                    <Confetti active={ success } config={confettiConfig} />
                    <span className="text-gray-100 transition duration-200 group-hover:text-gray-100">
                      {!isLoading ? "Run Code →" : "Loading..."}
                    </span>
                  </button>
                </div>
              </div>
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

            <Editor
              height="10rem"
              defaultLanguage="typescript"
              value={output.join('\n')}
              className="block w-1/2 text-white bg-gray-900 border-gray-300 rounded-lg shadow-sm p-0.5 border dark:border-purple-300 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              theme="vs-dark"
              options={{
                fontSize: 12,
                minimap: {enabled: false},
                readOnly: true,
                lineNumbers: "off",
                overviewRulerLanes: 0,
                renderLineHighlight: "none",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
