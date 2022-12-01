
import React, { useState, useCallback, useEffect } from "react";
import { useSession} from "next-auth/react";

import Credentials from "../components/credentials";

function Register( { lang } ) {
  
  const { data: session, status } = useSession()

  return (
    <>
      <div className="flex text-base md:text-lg lg:text-xl h-full justify-center items-center font-mplus">
        <div className="flex text-2xl pr-10 mr-10 border-r justify-center items-center border-white">
          <div>{lang === "EN"? "Register for Kaki" : "アカウントを登録する"}</div>
        </div>
        <Credentials type={"register"} lang={lang} />
      </div>
    </>
  );
};

export default Register;
