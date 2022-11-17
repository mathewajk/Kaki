import styles from '../styles/Home.module.css'
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

function Home( ) {
  
  const { data: session, status } = useSession()

  console.log(session);
  return (
    <main className="grid height-full width-full content-center font-mplus">

      {
        !session && (
          <div className="text-center ">
          <p className="text-splash color-orangered">Kaki</p>
          <p className="text-2xl mb-8">Speak Japanese with confidence.</p>
          <p><button><a href="/login">Sign in</a></button></p>
          </div>
        )
      }

      {session && (
        
            <div className="text-center content-center">
            Welcome, {session.user.name.split(" ")[0]}!
            </div>
        )
      }

    </main>
  );
};

export default Home;
