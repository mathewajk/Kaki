import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid'
import axios from "axios";
import Link from 'next/link'

const Credentials = ( { type, lang } ) => {

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
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md dark:bg-gray-700">
      <form className="mb-8">
        {showAlert && (<div className="text-base text-sm">{lang === "EN"? "This action is currently unavailable." : "現在このアクションは無効です。"}</div>)}

        {type === "login" && (
          <><div className="font-normal text-sm mb-3">Need an account? <Link className="text-orange-500" href={"/register"}>Register here!</Link></div>
          <div className="form-group mb-2">
            <label htmlFor="input-username-email-for-credentials-provider" className="form-label inline-block my-2">{lang === "EN"? "Username or email" : "ユーザーネームまたはEメール"}</label>
            <input label="Username or email" onChange={handleChange('username')} placeholder="me@example.com" value={formValues.username} id="input-username-email-for-credentials-provider" type="username" className="form-control w-full px-3 py-1.5 mb-2 border border-solid border-gray-300 rounded"></input>
          </div>
          </>
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
            <input label="Password" required onChange={handleChange('password')} placeholder='123' value={formValues.password} id="input-password-for-credentials-provider" type={formValues.showPassword ? 'text' : 'password'} className="form-control w-full px-3 py-1.5 my-2 border border-solid border-gray-300 rounded"></input>
            <button className="absolute mr-1 shadow-none bg-transparent hover:bg-transparent text-gray-800 dark:text-white" onClick={handleClickShowPassword}>{formValues.showPassword ? (<EyeIcon
            className="h-5 w-5"
            aria-hidden="true"/>) : (<EyeSlashIcon
                className="h-5 w-5"
                aria-hidden="true"/>) }</button>
            </div>
      </div>
      {type === "register" && (<div className="form-group mb-2">
            <label htmlFor="input-password-confirmation-for-credentials-provider" className="form-label inline-block my-2">{lang === "EN"? "Confirm password" : "パスワード"}</label>
            <div className="flex relative justify-end items-center">
                
            <input label="Password confirmation" required onChange={handleChange('passwordConf')} placeholder='123' value={formValues.passwordConf} id="input-password-confirmation-for-credentials-provider" type={formValues.showPassword ? 'text' : 'password'} className="form-control w-full px-3 py-1.5 my-2 border border-solid border-gray-300 rounded"></input>
            <button className="absolute mr-1 shadow-none bg-transparent hover:bg-transparent text-gray-800 dark:text-white" onClick={handleClickShowPassword}>{formValues.showPassword ? (<EyeIcon
            className="h-5 w-5"
            aria-hidden="true"/>) : (<EyeSlashIcon
                className="h-5 w-5"
                aria-hidden="true"/>) }</button>
            </div>
      </div>)}

        { (type === "login") && (
            <button type="submit" className="mt-2 w-full leading-tight shadow-md" onClick={handleCredentialLogin}>
              {lang === "EN"? "Log in" : "ログイン"}
            </button>
          ) 
        }

        { (type === "register") && (
            <button type="submit" className="kaki-button mt-2 w-full leading-tight shadow-md" onClick={handleRegistration}>
              {lang === "EN"? "Register" : "登録"}
            </button>
          )
        }
      </form>
      <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
            <p className="text-center font-bold mx-4 mb-0">{lang === "EN"? "OR" : "または"}</p>
        </div>

        <div className="kaki-button mb-5 text-center items-center">
          <button disabled className="bg-gray-500 hover:bg-gray-500 text-gray-300" onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000' })}>{lang === "EN"? "Log in with Google" : "Googleでログインする"}</button>
        </div>
    </div>
  )
}

export default Credentials;