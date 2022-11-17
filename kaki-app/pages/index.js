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
          <p className="text-splash color-orangered">カキ</p>
          <p className="text-2xl mb-8">日本語の発音をマスターしましょう。</p>
          <p><button className="kaki-button"><a href="/register">始める</a></button></p>
          </div>
        )
      }

      {session && (
        
            <div className="text-center content-center">
            ようこそ{session.user.name}様
            </div>
        )
      }

    </main>
  );
};

export default Home;
