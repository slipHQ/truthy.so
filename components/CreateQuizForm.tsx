import { Session } from "@supabase/supabase-js";
import React, { FormEvent, useState } from "react";
import classNames from "clsx";
import { Profile, SaveQuiz } from "../types";
import Editor from "@monaco-editor/react";

import PreviewQuiz from "./PreviewQuiz";

type FormInputProps = {
  name: string;
  label: string;
  sublabel: string;
  children: React.ReactChild;
};

const FormInput = (props: FormInputProps) => (
  <div className='space-y-3 sm:col-span-6'>
    <label htmlFor={props.name} className='text-base font-normal text-white'>
      {props.label}
    </label>
    <p className='text-sm text-white text-opacity-50'>{props.sublabel}</p>
    <div className=''>{props.children}</div>
  </div>
);

type CreateQuizFormProps = {
  session: Session;
  profile: Profile;
};

export default function CreateQuizForm({
  session,
  profile,
}: CreateQuizFormProps) {
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(false);
  const [solution, setSolution] = useState("");
  const [startCode, setStartCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className='flex justify-end'>
        {preview ? (
          <p className='text-white'>
            This is what your quiz will look like when you share it. Complete it
            and we'll include your solution!
          </p>
        ) : null}
      </div>

      {preview ? (
        <PreviewQuiz
          quiz={{
            language: "typescript",
            description,
            solution,
            start_code: startCode,
            target_output: output,
          }}
          session={session}
          profile={profile}
        />
      ) : null}
      <form>
        <div>
          <div>
            <div
              className={classNames(
                preview ? "hidden" : "",
                "grid grid-cols-1 mt-6 gap-y-12 sm:grid-cols-6"
              )}
            >
              <FormInput
                key='description'
                name='description'
                label='Enter a description'
                sublabel='Introduce your quiz and let users know what they should make the code do.'
              >
                <textarea
                  id='description'
                  name='description'
                  rows={5}
                  className='block w-full text-white bg-gray-600 bg-opacity-25 border-0 resize-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm rounded-xl'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required={true}
                />
              </FormInput>

              <FormInput
                key='startCode'
                name='startCode'
                label='Start code'
                sublabel='Enter the starter code that the user should update.'
              >
                <div className='relative group'>
                  <div className='absolute w-full h-full bg-4 group-hover:ring-4 group-hover:ring-indigo-500 group-hover:ring-opacity-50 rounded-xl' />
                  <Editor
                    height='15rem'
                    defaultLanguage='typescript'
                    defaultValue=''
                    onChange={(code: string) => setStartCode(code)}
                    className='block bg-[#1E1E1E] rounded-xl p-2 sm:text-sm'
                    theme='vs-dark'
                    options={{
                      fontSize: 12,
                      minimap: { enabled: false },
                      overviewRulerLanes: 0,
                      renderLineHighlight: "none",
                    }}
                  />
                </div>
              </FormInput>

              <FormInput
                key='output'
                name='output'
                label='Target output'
                sublabel='What should the user make the code output?'
              >
                <input
                  id='output'
                  name='output'
                  type='text'
                  className='block w-full py-4 text-white bg-gray-600 bg-opacity-25 border-0 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm rounded-xl'
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  required={true}
                />
              </FormInput>
            </div>
          </div>
        </div>
      </form>

      <div className='pt-5 mt-6'>
        <div className='flex items-center justify-start space-x-4'>
          <button
            type='button'
            className='w-32 py-4 text-sm font-medium text-center text-white transition bg-black border border-gray-800 rounded-md margin-auto hover:scale-105 disabled:hover:scale-100 disabled:opacity-50'
            onClick={() => setPreview(!preview)}
          >
            {/* <span className='text-gray-100 transition duration-200 group-hover:text-gray-100'> */}
            {preview ? "Back to Setup" : "Next Step"}
            {/* </span> */}
          </button>
        </div>
      </div>
    </>
  );
}
