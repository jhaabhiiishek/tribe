import '../App.css';
import React, { useState, useEffect } from 'react';
import Island from './Island';
import Navbar from './Navbar';
import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer'
import axios from 'axios';
import jwt_decode from 'jwt-decode'


import api from './api';

function App() {

  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(true);
  const [signup, setSignup] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [loginusername, setLoginUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginpassword, setLoginPassword] = useState("");
  const [emailOtpVerify, setEmailOtpVerify] = useState("");

  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  }

  const getCookie = (name) => {
    const value = document.cookie;
    try {
      const decodedToken = jwt_decode(value, process.env.TOKEN_KEY);
      return decodedToken
    } catch (error) {
    }
  };
  
  var nullCookie = true;
  var res_otp ;
  var res_email_sub;
  
  var studentCookie = getCookie('student');
  if(studentCookie!==undefined){
    nullCookie = false
  }



  async function email_sub(){
    api.post('/email_otp',{
      email_id:email
    }).then(response => {
      if(response.data.msg!=="Sent Successfully"){
        setEmailVerified(false)
      }
    });
  }

  async function signup_sub(){
    api.post('/signup',{
      phone:phone,
      email:email,
      user_id:username,
      password:password 
    }).then(response => {
      if(response.data.msg=="Success"){
        setSignup(false)
      }
    });
  }

  async function login_sub(e){
    e.preventDefault();
    api.post('/login',{
      user_id:loginusername,
      password:loginpassword 
    }, {
      withCredentials: true,
    }).then(response => {
      if(response.data.success===1){
        studentCookie = getCookie('student');
        setCookie('student', studentCookie, 7);
        nullCookie = false
      }else{
        console.log(response.data.msg)
      }
    });
  }

  var emailSubmit = (e)=>{
    if(email!==""){
      email_sub()
      setEmailOtpVerify(true);
      console.log(res_email_sub)
    }
  }
  async function otp_sub (){
    api.post('/verify_otp',{
      email_id:email,
      otp:otp
    }).then(response => {
      console.log(response);
    });
  }
  const otpSubmit = ()=>{
    if(email!==""){
      otp_sub()
      setEmailVerified(true);
      setSignup(true);
    }
  }

  // const posts = async()=>{
  //   axios.post('/fetch_user_post',{

  //   })
  // }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
  }, 800); // set the time for the animation to display

    return () => clearTimeout(timer);
  }, []);
    return (
        <div id='app'>
            {loading?(
                <div className="loading-animation">
                    Loading!
                    {/* A loading animation is required */}
                </div>
            ):(
            nullCookie===false?(
              <div>
                <Navbar/>,
                <Island/>,
                <div id='main-body'>
                  <div className="emptyDiv">
                  </div>
                  <LeftContainer/>,
                  <div className="emptyDiv">
                  </div>
                  <RightContainer/>
                </div>
              </div>
            ):
            (
              emailVerified?(
                signup?(
                  <div className='forms'>
                    <label htmlFor="Phone"><b>Phone no.</b></label>
                    <input type='tel' value={phone} onChange={(e) => setPhone(e.target.value)} pattern="[+]{1}[0-9]{11,14}" placeholder='Enter phone' name='phone'></input>
                    <label htmlFor="Email"><b>Email</b></label>
                    <input type='email' required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email' name='email'></input>
                    <label htmlFor="Username"><b>Username</b></label>
                    <input type='text' required value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter username' name='username'></input>
                    <label for="password"><b>Password</b></label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" name="password" required></input>
    
                    <button onClick={signup_sub} type='submit'>Sign Up</button>
                    <a onClick={()=>setSignup(false)}>Login</a>
                  </div>
                ):(
                  <form>
                    <div className='forms'>
                      <label htmlFor="loginusername"><b>Username</b></label>
                      <input type='text' value={loginusername} onChange={(e) => setLoginUsername(e.target.value)} placeholder='username/email or phone' name='loginusername' required></input>
    
                      <label htmlFor="loginpassword"><b>Password</b></label>
                      <input type="password" value={loginpassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter Password" name="loginpassword" required></input>
    
                      <button onClick={login_sub} type='submit'>Login</button>
                      <a onClick={()=>setEmailVerified(false)}>Sign up</a>
                    </div>
                  </form>
                )
              ):(
                emailOtpVerify?(
                  <form>
                    <div className='forms'>
                      <label htmlFor="email"><b>E-mail</b></label>
                      <input type='text' placeholder='Enter email' name='email' required value={email} onChange={(e) => setEmail(e.target.value)}></input>
                      <input type='text' placeholder='Enter OTP' name='otp' required value={otp} onChange={(e) => setOtp(e.target.value)}></input>
                      <button onClick={otpSubmit} type='submit'>Verify Otp</button>
                    </div>
                  </form>
                ):(
                  <form>
                    <div className='forms'>
                      <label htmlFor="email"><b>E-mail</b></label>
                      <input type='text' placeholder='Enter email' name='email' required value={email} onChange={(e) => setEmail(e.target.value)}></input>
                      <button onClick={emailSubmit} type='submit'>Verify Email</button>
                    </div>
                  </form>
                )
              )
            )
          )}            
        </div>
    )
}

export default App