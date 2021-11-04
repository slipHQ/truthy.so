import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import SignInButton from "../../components/SignInButton";
import PageTitle from "../../components/PageTitle";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import { Profile, Quiz } from "../../types";

export default function Account({ serverSideSession }) {
  const [session, setSession] = useState<Session>(serverSideSession);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [profile, setProfile] = useState<Profile>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    async function getProfile() {
      if (session) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url, full_name")
          .eq("id", session.user.id);

        if (profileError) throw profileError;
        if (profile) {
          setProfile(profile[0]);
        }
      }
    }

    async function getQuizzes() {
      if (session) {
        let { data: quizzes, error } = await supabase
          .from("quizzes")
          .select("*")
          .eq("created_by", session.user.id);

        if (error) throw error;
        if (quizzes) {
          setQuizzes(quizzes);
        }
        console.log(quizzes, error);
      }
    }

    getQuizzes();
    getProfile();
  }, [session]);

  async function signout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  const router = useRouter();
  const query = router.query;
  if (
    query.error &&
    query.error == "server_error" &&
    query.error_description &&
    query.error_description == "Error getting user email from external provider"
  ) {
    alert(
      "Sorry but we were unable to log you in. Please ensure that you have set an email address in Twitter and try again!"
    );
  }

  if (session && profile) {
    return (
      <>
        <div className='max-w-4xl px-4 pb-40 mx-auto sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto'>
            <div className='absolute flex flex-row items-center top-8 right-8'>
              <button
                className='px-3 py-2 text-sm text-white bg-opacity-25 rounded-md bg-gray-925'
                // className='absolute top-8 md:top-[35px] right-8 md:right-[120px] bg-gray-925 text-white px-3 py-2 rounded-md text-sm'
                onMouseDown={signout}
              >
                Log out
              </button>
            </div>
            <div className='max-w-4xl px-4 pt-8 pb-40 mx-auto sm:px-6 lg:px-8'>
              <div className='max-w-3xl mx-auto'>
                <PageTitle>Account</PageTitle>
                <div className='flex flex-row'>
                  <img
                    src={profile.avatar_url}
                    alt='avatar'
                    className='w-12 h-12 mr-4 rounded-full'
                  />
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
                <div className='mt-8'>
                  <p className='ml-2 text-sm font-bold text-white'>
                    My Quizzes
                  </p>
                </div>
                <div className='flow-root p-4 mt-6 bg-black bg-opacity-25 border border-gray-800 rounded-md'>
                  <ul role='list' className='-my-5 divide-y divide-gray-700'>
                    {console.log({ profile })}
                    {quizzes.map((quiz) => (
                      <li key={quiz.friendly_id} className='py-5'>
                        <div className='relative focus-within:ring-2 focus-within:ring-purple-500'>
                          <h3 className='ml-2 font-semibold text-gray-600 text-md'>
                            <a
                              href={`${process.env.NEXT_PUBLIC_HOME_URL}/q/${quiz.friendly_id}`}
                              className='hover:underline focus:outline-none'
                            >
                              {/* Extend touch target to entire panel */}
                              <span
                                className='absolute inset-0'
                                aria-hidden='true'
                              />
                              {quiz.friendly_id}
                            </a>
                          </h3>
                          <p className='mt-1 ml-2 text-sm text-gray-300 line-clamp-2'>
                            {quiz.description}
                          </p>
                          <span className='mt-4 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-opacity-10 bg-white text-gray-300'>
                            {quiz.language}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
}
