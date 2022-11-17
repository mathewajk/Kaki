import styles from '../styles/Home.module.css'
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import Link from 'next/link'
import Pitch from "../components/pitch";

function Home( { lang } ) {
  
  const { data: session, status } = useSession()

  console.log(session);
  return (
    <main className="grid height-full width-full content-center font-mplus">

      {
        !session && (
          <div className="text-center ">
          <p className="text-splash color-orangered">{lang==="EN" ? "Kaki" : "カキ"}</p>
          <p className="text-2xl mb-8">
            <div className="flex justify-center">
              <Pitch word={{tango: "日本語の発音を", yomi: "にほんごのはつおんを", pitch: 0}}/>
              <Pitch word={{tango: "マスター", yomi: "マスター", pitch: 1}}/>
              <Pitch word={{tango: "しよう", yomi: "しよう", pitch: 2}}/>
              </div>
              </p>
          <p><button className="kaki-button"><Link href="/register">{lang==="EN" ? "Get Started" : "始める"}</Link></button></p>
          </div>
        )
      }

      {session && (
        
            <div className="text-center content-center">
            {lang === "EN"? "Welcome, " + session.user.name.split(" ")[0] : "ようこそ" + session.user.name + "様"}
            </div>
        )
      }

    </main>
  );
};

export default Home;
