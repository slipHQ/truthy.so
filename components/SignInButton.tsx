import { supabase } from "../utils/supabaseClient";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SignInButton() {
  async function signInWithGithub() {
    const { error } = await supabase.auth.signIn(
      {
        provider: "twitter",
      },
      {
        redirectTo: `${process.env.NEXT_PUBLIC_HOME_URL}/quizzes/create`,
      }
    );
    if (error) throw error;
  }

  return (
    <button
      type='button'
      className='flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-200 border border-transparent rounded-md shadow-sm bg-gray-925 hover:text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      onMouseDown={signInWithGithub}
    >
      <span className='sr-only'>Sign in with Twitter</span>
      <FontAwesomeIcon
        className='w-5 h-5'
        aria-hidden='true'
        icon={faTwitter}
      />
      <p className='ml-2'>Sign in with Twitter</p>
    </button>
  );
}
