import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import CreateQuizForm from "../../components/CreateQuizForm";
import SignInButton from "../../components/SignInButton";
import PageTitle from "../../components/PageTitle";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import Image from "next/image";
import { Profile } from "../../types";

export default function Create({ serverSideSession }) {
  const [session, setSession] = useState<Session>(serverSideSession);
  const [profile, setProfile] = useState<Profile>();

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

    getProfile();
  }, [session]);

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
              <a href='/account'>
                <img
                  src={profile.avatar_url}
                  alt='avatar'
                  className='h-8 mr-4 rounded-full'
                  // className='absolute top-8 md:top-[35px] right-15 md:right-[120px] bg-gray-925 text-white px-3 py-2 rounded-md text-sm'
                />
              </a>
            </div>
            <div className='max-w-4xl px-4 pt-8 pb-40 mx-auto sm:px-6 lg:px-8'>
              <div className='max-w-3xl mx-auto'>
                <PageTitle>Create Quiz</PageTitle>
                <CreateQuizForm session={session} profile={profile} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className='flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <img className='w-auto h-12 mx-auto' src='/logo.png' />
            <h2 className='mt-6 text-3xl font-extrabold text-center text-white'>
              Log in to create a quiz
            </h2>
          </div>

          <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
            <div className='px-4 py-8 border border-gray-500 rounded-lg shadow sm:rounded-lg sm:px-10'>
              <div className='flex items-center justify-center'>
                <SignInButton />
                <div className='relative mx-auto'></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
