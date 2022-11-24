
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState, useCallback, useEffect } from "react";
import CredentialForm from "../components/credentialform";

function Login( { lang } ) {
  
  const { data: session, status } = useSession()

  if(session) {
    // redirect
  }

  return (
    <div className="flex text-base md:text-lg lg:text-xl h-full justify-center items-center font-mplus">
            <div className="flex text-2xl pr-10 mr-10 border-r h-1/2 justify-center items-center border-gray-800 dark:border-gray-200"><div>{lang === "EN"? "Log in to Kaki" : "カキにログインする"}</div></div>
            <div className="p-6 bg-white rounded-lg shadow-lg max-w-md dark:bg-gray-700">
        <CredentialForm type={"login"} lang={lang} />
        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
            <p className="text-center font-bold mx-4 mb-0">{lang === "EN"? "OR" : "または"}</p>
        </div>

        <div className="mb-5 text-center items-center"><button type="button" onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000' })}>{lang === "EN"? "Log in with Google" : "Googleでログインする"}</button></div>
        
        </div>
    </div>
  );
};

export default Login;
