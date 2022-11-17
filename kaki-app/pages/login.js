import styles from '../styles/Home.module.css'
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState, useCallback, useEffect } from "react";

function Login( ) {
  
  const { data: session, status } = useSession()
  
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',    
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
    //e.preventDefault();
    setFormValues({ ...formValues, showPassword: !formValues.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCredentialLogin = async (e) => {    
    e.preventDefault();
    console.log(formValues);
    signIn("credentials", {
      redirect: true,
      username: formValues.username,
      password: formValues.password,
      callbackUrl: '/'
    });
  };

  return (
    <>
        <div className="flex text-base md:text-lg lg:text-xl h-full justify-center items-center font-mplus">
            <div className="p-6 bg-white rounded-lg shadow-lg max-w-sm">
            <form className="mb-8">
            <div className="form-group mb-2">
                <label htmlFor="input-username-for-credentials-provider" className="form-label inline-block mb-2">Username</label>
                <input label="Username" onChange={handleChange('username')} value={formValues.username} id="input-username-for-credentials-provider" type="username" className="form-control w-full px-3 py-1.5 mb-2 border border-solid border-gray-300 rounded"></input>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="input-password-for-credentials-provider" className="form-label inline-block mb-2">Password</label>
                <input label="Password" required onChange={handleChange('password')} placeholder='123' value={formValues.password} id="input-password-for-credentials-provider" type={formValues.showPassword ? 'text' : 'password'} className="form-control w-full px-3 py-1.5 mb-2 border border-solid border-gray-300 rounded"></input>
                <input type="checkbox" onClick={handleClickShowPassword}></input> Show password
            </div>
            <button type="submit" className="leading-tight shadow-md" onClick={handleCredentialLogin}>Submit</button> 
       </form>

        
        
        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
            <p className="text-center font-bold mx-4 mb-0">OR</p>
        </div>

        <div className="mb-5 text-center items-center"><button type="button" onClick={() => signIn("google")}>Sign in with Google</button></div>
        
        </div>
    </div>
    </>
  );
};

export default Login;
