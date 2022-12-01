
import { useSession } from "next-auth/react";
import React from "react";
import CredentialForm from "../components/credentialform";

function Login( { lang } ) {
  
  const { data: session, status } = useSession()

  if(session) {
    // redirect
  }

  return (
    <div className="flex text-base md:text-lg lg:text-xl h-full justify-center items-center font-mplus">
      <div className="flex text-2xl pr-10 mr-10 border-r h-1/2 justify-center items-center border-gray-800 dark:border-gray-200">
        <div>{lang === "EN"? "Log in to Kaki" : "カキにログインする"}</div>
      </div>
      <CredentialForm type={"login"} lang={lang} />
    </div>
  );
};

export default Login;
