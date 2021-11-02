import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import CreateQuizForm from "../../components/CreateQuizForm";
import SignInButton from "../../components/SignInButton";
import PageTitle from "../../components/PageTitle";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from 'next/router'
import Image from "next/image";

export default function Create() {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function signout() {
    const { error } = await supabase.auth.signOut();
    if(error) throw error
  }

  const router = useRouter()
  const query = router.query
  if(query.error && query.error == "server_error" && query.error_description && query.error_description == "Error getting user email from external provider") {
    alert("Sorry but we were unable to log you in. Please ensure that you have set an email address in Twitter and try again!")
  }

  if (session) {
    console.log(session.user);
    return (
      <>
        {/* <button onMouseDown={signout}>Log out</button> */}
        <div className="max-w-4xl px-4 py-40 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <PageTitle>Create Quiz</PageTitle>
            <CreateQuizForm session={session} />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <h1>Log in to create a quiz!</h1>
        <SignInButton />
      </>
    );
  }
}
