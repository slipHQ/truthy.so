import { Session } from "@supabase/supabase-js";
import React, { FormEvent, useEffect, useState } from "react";
import Hashids from "hashids";
import classNames from "classnames";
import { Profile, SaveQuiz, Explanation } from "../types";
import Editor from "@monaco-editor/react";
import { supabase } from "../utils/supabaseClient";
import PreviewQuiz from "./PreviewQuiz";
import ExplanationForm from "./ExplanationForm";
import useTypescript from "../hooks/useTypescript";

const hashids = new Hashids();

type FormInputProps = {
  name: string;
  label: string;
  sublabel: string;
  children: React.ReactChild;
};

const FormInput = (props: FormInputProps) => (
  <div className="space-y-3 sm:col-span-6">
    <label htmlFor={props.name} className="text-base font-normal text-white">
      {props.label}
    </label>
    <p className="text-sm text-white text-opacity-50">{props.sublabel}</p>
    <div className="">{props.children}</div>
  </div>
);

type CreateQuizFormProps = {
  session: Session;
  profile: Profile;
};

enum FormStep {
  Task = 0,
  Solution = 1,
  Explanation = 2,
}

export default function CreateQuizForm({
  session,
  profile,
}: CreateQuizFormProps) {
  const [description, setDescription] = useState("");
  const [formStep, setFormStep] = useState<FormStep>(FormStep.Task);
  const [solution, setSolution] = useState("");
  const [startCode, setStartCode] = useState("");
  const [output, setOutput] = useState("");
  const [explanation, setExplanation] = useState<Explanation>();
  const { tsClient, tsLoading } = useTypescript();
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState(null);

  async function saveQuiz() {
    setLoading(true);

    const now = new Date();
    const insertQuiz: SaveQuiz = {
      language: "typescript",
      description,
      solution,
      start_code: startCode,
      target_output: output,
      explanation,
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

  const steps = {
    [FormStep.Task]: (
      <form>
        <div
          className={classNames(
            "grid grid-cols-1 mt-6 gap-y-12 sm:grid-cols-6"
          )}
        >
          <FormInput
            key="description"
            name="description"
            label="Enter a description"
            sublabel="Introduce your quiz and let users know what they should make the code output to the console."
          >
            <textarea
              id="description"
              name="description"
              rows={5}
              className="block w-full text-white bg-gray-600 bg-opacity-25 border-0 resize-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm rounded-xl"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required={true}
            />
          </FormInput>

          <FormInput
            key="startCode"
            name="startCode"
            label="Start code"
            sublabel="Enter the starter code that the user should update."
          >
            <div className="relative group">
              <div className="absolute w-full h-full bg-4 group-hover:ring-4 group-hover:ring-indigo-500 group-hover:ring-opacity-50 rounded-xl" />
              <Editor
                height="15rem"
                defaultLanguage="typescript"
                defaultValue=""
                onChange={(code: string) => setStartCode(code)}
                className="block bg-[#1E1E1E] rounded-xl p-2 sm:text-sm"
                theme="vs-dark"
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
            key="output"
            name="output"
            label="Target output"
            sublabel="What should the user make the code output?"
          >
            <input
              id="output"
              name="output"
              type="text"
              className="block w-full py-4 text-white bg-gray-600 bg-opacity-25 border-0 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm rounded-xl"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              required={true}
            />
          </FormInput>
        </div>
      </form>
    ),
    [FormStep.Solution]: (
      <div>
        <div className="flex">
          <p className="text-white">
            Complete your quiz and we'll include the solution!
          </p>
        </div>
        <PreviewQuiz
          key={startCode}
          quiz={{
            language: "typescript",
            description,
            solution,
            start_code: startCode,
            target_output: output,
          }}
          session={session}
          profile={profile}
          onSolution={(solution) => {
            setSolution(solution);
          }}
        />
      </div>
    ),
    [FormStep.Explanation]: (
      <div>
        <div className="flex">
          <p className="text-white">
            If you'd like, you can create a guided explanation of the solution
            code.
          </p>
        </div>
        <ExplanationForm solution={solution} onChange={setExplanation} />
      </div>
    ),
  };

  return (
    <>
      <div className={classNames(formStep !== FormStep.Task && "hidden")}>
        {steps[FormStep.Task]}
      </div>
      <div className={classNames(formStep !== FormStep.Solution && "hidden")}>
        {steps[FormStep.Solution]}
      </div>
      <div
        className={classNames(formStep !== FormStep.Explanation && "hidden")}
      >
        {steps[FormStep.Explanation]}
      </div>
      {/* {steps[formStep]} */}
      <div className="pt-5 mt-6">
        <div className="flex justify-between">
          <div className="space-x-4">
            {formStep > FormStep.Task && (
              <button
                type="button"
                className="w-32 py-4 text-sm font-medium text-center text-white transition bg-black border border-gray-800 rounded-md margin-auto hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
                onClick={() => setFormStep((prev) => prev - 1)}
              >
                {"Go Back"}
              </button>
            )}
            {formStep < FormStep.Explanation && (
              <button
                type="button"
                className="w-32 py-4 text-sm font-medium text-center text-white transition bg-black border border-gray-800 rounded-md margin-auto hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
                onClick={() => setFormStep((prev) => prev + 1)}
                disabled={formStep === FormStep.Solution && !solution}
              >
                {"Next Step"}
              </button>
            )}
          </div>
          {formStep === FormStep.Explanation && (
            <div className="flex items-center justify-end space-x-4">
              <button
                type="submit"
                className="px-20 py-4 font-medium text-white transition gradient-cta rounded-xl focus:ring-2 focus:ring-white hover:scale-105 disabled:opacity-50"
                onClick={saveQuiz}
              >
                Save
              </button>
            </div>
          )}
        </div>
        {createdUrl && (
          <div className="text-lg text-white my-8">
            Quiz created successfully!{" "}
            <a className="font-medium underline" href={createdUrl}>
              {createdUrl}
            </a>
          </div>
        )}
      </div>
    </>
  );
}
