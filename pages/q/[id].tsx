import { supabase } from "../../utils/supabaseClient";
import Hashids from "hashids";
const hashids = new Hashids();

type Quiz = {
  description: string;
  start_code: string;
  target_output: string;
  language: string;
};

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

export default function Quiz({ quiz }) {
  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <main className="mx-auto mb-12 max-w-7xl sm:mt-12">
          <div className="text-left">
            {/* <h1 className="text-3xl tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-5xl">
                <span className="block font-mono xl:inline">
                  Embed executable code snippets on your site
                </span>
              </h1> */}
            <p className="max-w-md mt-4 text-base text-gray-500 dark:text-gray-450 md:mx-auto sm:text-lg md:mt-16 md:text-xl md:max-w-3xl">
              {quiz.description}
            </p>
          </div>
        </main>

        <div>
          <div className="mt-1 ">
            <div className="relative group">
              <div className="absolute -inset-0.5 dark:bg-gradient-to-r from-indigo-300 to-purple-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
              <pre>{quiz.start_code}</pre>
            </div>
          </div>
        </div>

        <div className="pt-8 ">
          <div className="grid items-start justify-left">
            <div className="relative group">
              <button
                className="relative flex items-center py-4 leading-none bg-black divide-x divide-gray-600 rounded-lg px-7 border-gray-300 disabled:bg-gray-700 disabled:cursor-not-allowed"
                // onClick={() => runCode(inputCodeRef.current)}
                // disabled={isLoading}
              >
                <span className="text-gray-100 transition duration-200 group-hover:text-gray-100">
                  {/* {!isLoading ? 'Run Code →' : `Loading ${languageLabel}...`} */}
                  Run Code →
                </span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block pt-8 text-sm font-medium text-gray-700 dark:text-gray-450">
            Output
          </label>

          <div className="mt-1 dark:text-gray-450">Output Editor here!</div>
        </div>
      </div>
    </div>
  );
}
