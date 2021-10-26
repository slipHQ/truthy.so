import { Session } from "@supabase/supabase-js";
import { FormEvent, useState } from "react";
import { SaveQuiz } from "../types";
import { supabase } from "../utils/supabaseClient";

import Hashids from "hashids";
const hashids = new Hashids();


type PropTypes = {
  session: Session
}

export default function CreateQuizForm({session}: PropTypes) {
  const [description, setDescription] = useState("")
  const [startCode, setStartCode] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [createdUrl, setCreatedUrl] = useState(null)

  const saveQuiz = async (e: FormEvent) => {
    setLoading(true)
    e.preventDefault()

    const now = new Date()
    const quiz: SaveQuiz = {
      description,
      start_code: startCode,
      target_output: output,
      language: 'typescript',
      created_at: now,
      updated_at: now,
      created_by: session.user.id
    }

    // Insert the quiz without a friendly ID
    // Note that friendly ID isn't required, it's just helpful for debugging
    const { data: insertData, error: insertError } = await supabase.from('quizzes').insert(quiz)
    setLoading(false)
    if(insertError) throw insertError

    // Generate the friendly (hashed) ID for the created quiz
    const insertedId = insertData[0].id
    const hashedId = hashids.encode(insertedId)

    const url = `${process.env.NEXT_PUBLIC_HOME_URL}/q/${hashedId}`
    setCreatedUrl(url)

    // Update the quiz to include the friendly ID
    await supabase
      .from('quizzes')
      .update({friendly_id: hashedId,})
      .eq('id', insertedId)
  }


  return (
    <form className="space-y-8 divide-y divide-gray-200" onSubmit={saveQuiz}>
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required={true}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Introduce your quiz and let users know what they should make the code do
              </p>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="startCode"
                className="block text-sm font-medium text-gray-700"
              >
                Start Code (will be run-wasm)
              </label>
              <div className="mt-1">
                <textarea
                  id="startCode"
                  name="startCode"
                  rows={6}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  value={startCode}
                  onChange={(e) => setStartCode(e.target.value)}
                  required={true}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                What should the user make the code output?
              </p>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="output"
                className="block text-sm font-medium text-gray-700"
              >
                Target output
              </label>
              <div className="mt-1">
                <input
                  id="output"
                  name="output"
                  type="text"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  required={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-between">
          {createdUrl? (
            <span className="text-green-600">Quiz created successfully!{" "}
              <a className="font-medium underline text-green-800 hover:text-green-700" href={createdUrl}>{createdUrl}</a>
            </span>) : <span />}
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
}
