import { Session } from "@supabase/supabase-js";
import React, { FormEvent, useState } from "react";
import { SaveQuiz } from "../types";
import { supabase } from "../utils/supabaseClient";
import Editor from "@monaco-editor/react";

import Hashids from "hashids";
const hashids = new Hashids();

type FormInputProps = {
  name: string;
  label: string;
  sublabel: string;
  children: React.ReactChild;
};

const FormInput = (props: FormInputProps) => (
  <div className="sm:col-span-6 space-y-3">
    <label htmlFor={props.name} className="text-base font-normal text-white">
      {props.label}
    </label>
    <p className="text-sm text-white text-opacity-50">{props.sublabel}</p>
    <div className="">{props.children}</div>
  </div>
);

type CreateQuizFormProps = {
  session: Session;
};

export default function CreateQuizForm({ session }: CreateQuizFormProps) {
  const [description, setDescription] = useState("");
  const [startCode, setStartCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState(null);

  const saveQuiz = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const now = new Date();
    const quiz: SaveQuiz = {
      description,
      start_code: startCode,
      target_output: output,
      language: "typescript",
      created_at: now,
      updated_at: now,
      created_by: session.user.id,
    };

    // Insert the quiz without a friendly ID
    // Note that friendly ID isn't required, it's just helpful for debugging
    const { data: insertData, error: insertError } = await supabase
      .from("quizzes")
      .insert(quiz);
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
  };

  return (
    <form onSubmit={saveQuiz}>
      <div>
        <div>
          <div className="mt-6 grid grid-cols-1 gap-y-12 sm:grid-cols-6">
            <FormInput
              key="description"
              name="description"
              label="Enter a description"
              sublabel="Introduce your quiz and let users know what they should make the code do."
            >
              <textarea
                id="description"
                name="description"
                rows={5}
                className="bg-gray-600 bg-opacity-25 text-white focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 block w-full sm:text-sm border-0 rounded-xl resize-none"
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
                <div className="absolute bg-4 w-full h-full group-hover:ring-4 group-hover:ring-indigo-500  group-hover:ring-opacity-50 rounded-xl" />
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
                className="bg-gray-600 bg-opacity-25 text-white focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 block w-full sm:text-sm border-0 rounded-xl py-4"
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                required={true}
              />
            </FormInput>
          </div>
        </div>
      </div>

      <div className="pt-5 mt-6">
        <div className="flex justify-between">
          {createdUrl ? (
            <span className="text-pink-800">
              Quiz created successfully!{" "}
              <a
                className="font-medium underline text-pink-600 hover:text-pink-700"
                href={createdUrl}
              >
                {createdUrl}
              </a>
            </span>
          ) : (
            <span />
          )}
          <button
            type="submit"
            className="gradient-cta rounded-xl px-20 py-4 font-medium text-white focus:ring-2 focus:ring-white hover:scale-105 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
