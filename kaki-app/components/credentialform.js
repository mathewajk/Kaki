import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState, useCallback, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid'
import axios from "axios";

export async function getStaticProps() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
}

const CredentialForm = ( { type, lang } ) => {

  const [formValues, setFormValues] = useState({
    username: '',
    password: '', 
    email: '',
    passwordConf: '',  
    showPassword: false,
    rememberMe: false
  });
      
  const [showAlert, setShowAlert] = useState(false);
  
  const handleRememberMe = (prop) => (event) => {
    setFormValues({ ...formValues, rememberMe: !rememberMe });
  };
  
  const handleChange = (prop) => (event) => {
    setFormValues({ ...formValues, [prop]: event.target.value });
  };
  
  const handleClickShowPassword = (e) => {
    e.preventDefault();
    setFormValues({ ...formValues, showPassword: !formValues.showPassword });
  };
  
  const handleCredentialLogin = async (e) => {    
    e.preventDefault();
    console.log("Logging in!");
    signIn("credentials", {
      redirect: true,
      username: formValues.username,
      password: formValues.password,
      callbackUrl: '/'
    });
  };
  
  const handleRegistration = async (e) => {    
    
    e.preventDefault();

    const userData = {
      username: formValues.username,
      email: formValues.email,
      password1: formValues.password,
      password2: formValues.passwordConf
    };

    console.log("Attempting registration...");
    console.log(userData);
    //setShowAlert(true);
    try {
      console.log("In try");
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "api/auth/registration/", 
        userData
      );
      console.log(response);
      signIn("credentials", {
        redirect: true,
        username: formValues.username,
        password: formValues.password,
        callbackUrl: '/'
      });
    } catch(error){
      console.log("Registration failed!");
      console.log(error);
    }
  };

  return(
    <form className="mb-8">
            
            {showAlert && (<div className="text-base text-sm">{lang === "EN"? "This action is currently unavailable." : "現在このアクションは無効です。"}</div>)}

            {type === "login" && (
              <div className="form-group mb-2">
                <label htmlFor="input-username-email-for-credentials-provider" className="form-label inline-block my-2">{lang === "EN"? "Username or email" : "ユーザーネームまたはEメール"}</label>
                <input label="Username or email" onChange={handleChange('username')} placeholder="me@example.com" value={formValues.username} id="input-username-email-for-credentials-provider" type="username" className="form-control w-full px-3 py-1.5 mb-2 border border-solid border-gray-300 rounded"></input>
              </div>
            )}
            
            {type === "register" && (
              <>
              <div className="form-group mb-2">
                  <label htmlFor="input-email-for-credentials-provider" className="form-label inline-block my-2">{lang === "EN"? "Username" : "ユーザーネーム"}</label>
                  <input label="Username" onChange={handleChange('username')} placeholder="janedoe" value={formValues.username} id="input-email-for-credentials-provider" type="username" className="form-control w-full px-3 py-1.5 mb-2 border border-solid border-gray-300 rounded"></input>
              </div>
              <div className="form-group mb-2">
                  <label htmlFor="input-email-for-credentials-provider" className="form-label inline-block my-2">{lang === "EN"? "Email" : "Eメール"}</label>
                  <input label="Email" onChange={handleChange('email')} placeholder="me@example.com" value={formValues.email} id="input-email-for-credentials-provider" type="email" className="form-control w-full px-3 py-1.5 mb-2 border border-solid border-gray-300 rounded"></input>
              </div>
              </>
            )}
            
            <div className="form-group mb-2">
                <label htmlFor="input-password-for-credentials-provider" className="form-label inline-block my-2">{lang === "EN"? "Password" : "パスワード"}</label>
                <div className="flex relative justify-end items-center">
                    <button className="absolute mr-1 shadow-none bg-transparent hover:bg-transparent text-gray-800 dark:text-white" onClick={handleClickShowPassword}>{formValues.showPassword ? (<EyeIcon
                className="h-5 w-5"
                aria-hidden="true"/>) : (<EyeSlashIcon
                    className="h-5 w-5"
                    aria-hidden="true"/>) }</button>
                <input label="Password" required onChange={handleChange('password')} placeholder='123' value={formValues.password} id="input-password-for-credentials-provider" type={formValues.showPassword ? 'text' : 'password'} className="form-control w-full px-3 py-1.5 my-2 border border-solid border-gray-300 rounded"></input>
                </div>
           </div>
           {type === "register" && (<div className="form-group mb-2">
                <label htmlFor="input-password-confirmation-for-credentials-provider" className="form-label inline-block my-2">{lang === "EN"? "Confirm password" : "パスワード"}</label>
                <div className="flex relative justify-end items-center">
                    <button className="absolute mr-1 shadow-none bg-transparent hover:bg-transparent text-gray-800 dark:text-white" onClick={handleClickShowPassword}>{formValues.showPassword ? (<EyeIcon
                className="h-5 w-5"
                aria-hidden="true"/>) : (<EyeSlashIcon
                    className="h-5 w-5"
                    aria-hidden="true"/>) }</button>
                <input label="Password confirmation" required onChange={handleChange('passwordConf')} placeholder='123' value={formValues.passwordConf} id="input-password-confirmation-for-credentials-provider" type={formValues.showPassword ? 'text' : 'password'} className="form-control w-full px-3 py-1.5 my-2 border border-solid border-gray-300 rounded"></input>
                </div>
           </div>)}

            { (type === "login") && (
                <button className="kaki-button mt-2 w-full leading-tight shadow-md" onClick={handleCredentialLogin}>
                  {lang === "EN"? "Log in" : "ログイン"}
                </button>
              ) 
            }

            { (type === "register") && (
                <button className="kaki-button mt-2 w-full leading-tight shadow-md" onClick={handleRegistration}>
                  {lang === "EN"? "Register" : "登録"}
                </button>
              )
            }
       </form>
  )
}

export default CredentialForm;