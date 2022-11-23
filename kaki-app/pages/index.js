import styles from '../styles/Home.module.css'
import { signOut, useSession } from "next-auth/react";
import React from "react";
import Link from 'next/link'
import Pitch from "../components/pitch";

function Home( { lang } ) {
  
  const { data: session, status } = useSession()

  if(status == "loading") return (<></>);
  
  if(session?.error === "RefreshAccessTokenError") {
    signOut();
  }

  if(session) console.log(session.user);

  return (
    <section className="flex flex-col h-full w-full justify-center items-center content-center font-mplus lg:text-2xl md:text-xl sm:text-lg ">

      {
        !session && (
          <><div className="grid">
            <p className="text-7xl md:text-9xl lg:text-splash leading-none mb-4 color-orangered">{lang==="EN" ? "Kaki" : "カキ"}</p>
          </div>
          
          <div className="text-2xl mb-8">
            <div className="flex justify-center">
              <Pitch word={{tango: "日本語の発音を", yomi: "にほんごのはつおんを", pitch: 0}}/>
              <Pitch word={{tango: "マスター", yomi: "マスター", pitch: 1}}/>
              <Pitch word={{tango: "しよう", yomi: "しよう", pitch: 2}}/>
            </div>
          </div>
          
          <p><button className="kaki-button"><Link href="/register">{lang==="EN" ? "Get Started" : "始める"}</Link></button></p>
          </>
        )
      }

      {session && (
        
            <div className="text-center content-center">
              <WelcomeMessage lang={lang} user={session.user}/>
            </div>
        )
      }

    </section>
  );
};

const WelcomeMessage = ( {lang, user} ) => {
  return (
    <>
    {lang === 'EN' && `Welcome, ${user.name.split(" ")[0]}!`}
    {lang === 'JA' && `ようこそ${user.name}様`}
    </>
  );
}

export default Home;
