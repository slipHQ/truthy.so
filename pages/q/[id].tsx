import { supabase } from "../../utils/supabaseClient";
import Hashids from "hashids";
import { Profile, Quiz } from "../../types";
const hashids = new Hashids();
import React, { useRef } from "react";
import RunCodeEditor from "../../components/RunCodeEditor";
import Confetti from "react-dom-confetti";
import useTypescript from "../../hooks/useTypescript";
import useRunCode from "../../hooks/useRunCode";
import { confettiConfig } from "../../utils/confettiConfig";
import OutputEditor from "../../components/OutputEditor";
import Footer from "../../components/Footer";
import ViewCounter from "../../components/ViewCounter";

export async function getServerSideProps({ params }) {
  const id: string = params.id;
  const supabaseId = hashids.decode(id)[0];

  const { data, error } = await supabase
    .from("quizzes")
    .select("description, start_code, target_output, language, created_by, id")
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
  const codeRef = useRef(quiz.start_code);
  const { runCode, codeRunning, output, errors, hasCodeRun, success } =
    useRunCode(tsClient, codeRef, quiz.target_output);

  return (
    <>
      <div className='max-w-4xl pt-20 pb-48 mx-auto sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto'>
          <div className='flex justify-between px-4'>
            <div className='flex flex-row'>
              <img
                src={profile.avatar_url}
                alt='avatar'
                className='w-12 h-12 mr-4 rounded-full'
              />
              <div>
                <div>
                  <p className='font-bold text-white text-md'>
                    {profile.full_name}
                  </p>
                  <a
                    className='text-sm font-bold text-gray-500'
                    href={`https://www.twitter.com/${profile.username}`}
                    target='_blank'
                  >
                    @{profile.username}
                  </a>
                </div>
              </div>
            </div>
            <div className='flex flex-col justify-end mx-8 text-sm text-gray-500'>
              <p className='text-gray-200'>{ViewCounter(parseInt(quiz.id))}</p>
              {quiz.language}
            </div>
          </div>
          <p className='max-w-md px-4 mx-auto mt-4 mb-12 text-base text-left text-white whitespace-pre-wrap sm:mt-12 md:mx-auto sm:text-lg md:mt-16 md:text-xl md:max-w-3xl'>
            {quiz.description}
          </p>

          <RunCodeEditor
            codeRef={codeRef}
            runCode={runCode}
            hasCodeRun={hasCodeRun}
            output={output}
            height='20rem'
          />

          <div className='px-4 pt-8 sm:px-0'>
            <button
              className='relative flex items-center px-4 py-2 text-sm font-medium text-white transition rounded-md font-ibm gradient-cta hover:scale-105 disabled:hover:scale-100 disabled:opacity-50'
              onClick={runCode}
              disabled={codeRunning || tsLoading}
            >
              <Confetti active={success} config={confettiConfig} />
              <span className='text-gray-100 transition duration-200 group-hover:text-gray-100'>
                {tsLoading || codeRunning ? "Loading..." : "Run Code →"}
              </span>
            </button>
          </div>

          {errors.length > 0 ? (
            <div>
              <label className='block pt-8 pb-2 text-sm font-medium text-white'>
                Errors
              </label>
              <div className='p-4 bg-gray-300 rounded-md bg-opacity-20 max-w-max lg:bg-transparent'>
                {errors.map((error, index) => (
                  <div key={index}>
                    <p className='text-sm text-red-400'>{error}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <label className='block pt-8 pb-2 text-sm font-medium text-white'>
              Output
            </label>

            <OutputEditor output={output} height='10rem' />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
