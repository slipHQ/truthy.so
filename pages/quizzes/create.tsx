import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import CreateQuizForm from "../../components/CreateQuizForm";
import SignInButton from "../../components/SignInButton";
import { supabase } from "../../utils/supabaseClient";

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

  if (session) {
    console.log(session.user);
    return (
      <>
        <h1>Create UI!</h1>
        <button onMouseDown={signout}>Log out</button>

        <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p>Create quiz UI here!</p>
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
