import '../App.css';
import React, { useState, useEffect } from 'react';
import Island from './Island';
import Navbar from './Navbar';
import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer'
import axios from 'axios';
import getCookie from './getCookie';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = axios.create({
  baseURL: 'http://localhost:8080/',
});
function App() {

  useEffect(()=>{
    const studentCookie= getCookie();
    console.log(getCookie())
    if(studentCookie!==undefined){
      console.log("Previous exists")
      setNullCookie(false)
    }
  }, []) 
  
    const [loading, setLoading] = useState(true);
    const [emailVerified, setEmailVerified] = useState(true);
    const [nullCookie, setNullCookie] = useState(true);
    const [signup, setSignup] = useState(false);
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [loginusername, setLoginUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginpassword, setLoginPassword] = useState("");
    const [emailOtpVerify, setOtpVerify] = useState(false);


  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    setNullCookie(false)
  }

  const diffToast = (msg)=>{
    console.log(msg)
    if(msg.data.success===0){
        toast.error(msg.data.msg,{
            position:"bottom-center"
        });
    }else{
      toast.success(msg.data.msg,{
          position:"bottom-center"
      });
    }
  }

  
  const email_sub = async function(e){
    e.preventDefault()
    api.post('/email_otp',{
      email_id:email
    }).then(response => {
      console.log(response)
      if(response.data.success===1){
        setOtpVerify(true)
        setEmailVerified(false)
      }
      diffToast(response)
    });
  }

  const signup_sub= async function(){
    api.post('/signup',{
      phone:phone,
      email:email,
      user_id:username,
      password:password 
    }).then(response => {
      if(response.data.success==1){
        setSignup(false)
      }
      diffToast(response)
    });
  }

  const login_sub = async function(e){
    e.preventDefault();
    api.post('/login',{
      user_id:loginusername,
      password:loginpassword 
    }, {
      withCredentials: true,
    }).then(response => {
      if(response.data.success===1){
        const cookie = getCookie()
        if(cookie!==undefined){
          console.log(cookie)
          setNullCookie(false)
        }
      }
      diffToast(response)
    });
  }
  
  const loginSubmit = (e)=>{
    if(loginusername!=="" && loginpassword!==""){
      login_sub(e)
    }
  }

  const loginfromemail = ()=>{
    window.location.reload()
  }

  const notifToast = (msg)=>{
    toast.success(msg,{
        position:"bottom-center"
    });
  }

  var emailSubmit = (e)=>{
    notifToast("requested, please wait")
    if(email!==""){
      email_sub(e)
    }
  }
  const otp_sub = (e)=>{
    console.log("3")
    e.preventDefault()
    api.post('/verify_otp',{
      email_id:email,
      otp:otp
    }).then(response => {
      console.log("3")
      console.log(response);
      console.log(response.data.msg);
      if(response.data.success==1){
        setEmailVerified(true);
        setSignup(true);
      }
      diffToast(response)
    });
  }
  const otpSubmit =(e)=>{
    console.log("1")
    if(email!==""){
      console.log("2")
      otp_sub(e)
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
            nullCookie==false?(
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
                    <label htmlFor="password"><b>Password</b></label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" name="password" required></input>
    
                    <button onClick={signup_sub} type='submit'>Sign Up</button>
                    <a onClick={()=>setSignup(false)}>Login</a>
                    <ToastContainer/>
                  </div>
                ):(
                  <form>
                    <div className='forms'>
                      <label htmlFor="loginusername"><b>Username</b></label>
                      <input type='text' value={loginusername} onChange={(e) => setLoginUsername(e.target.value)} placeholder='username/email or phone' name='loginusername' required></input>
    
                      <label htmlFor="loginpassword"><b>Password</b></label>
                      <input type="password" value={loginpassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter Password" name="loginpassword" required></input>
    
                      <button onClick={loginSubmit} type='submit'>Login</button>
                      <a onClick={()=>setEmailVerified(false)}>Sign up</a>
                    </div>
                    <ToastContainer/>
                  </form>
                )
              ):(
                emailOtpVerify?(
                  <form>
                    <div className='forms'>
                      <label htmlFor="email"><b>E-mail</b></label>
                      <input type='text' placeholder='Enter email' name='email' required value={email} onChange={(e) => setEmail(e.target.value)}></input>
                      <input type='text' placeholder='Enter OTP' name='otp' required value={otp} onChange={(e) => setOtp(e.target.value)}></input>
                      <button onClick={(e)=>otpSubmit(e)} type='submit'>Verify Otp</button>
                    </div>
                    <ToastContainer/>
                  </form>
                ):(
                  <form>
                    <div className='forms'>
                      <label htmlFor="email"><b>E-mail</b></label>
                      <input type='text' placeholder='Enter email' name='email' required value={email} onChange={(e) => setEmail(e.target.value)}></input>
                      <button onClick={emailSubmit} type='submit'>Verify Email</button>
                      <a onClick={loginfromemail}>Login</a>
                    </div>
                    <ToastContainer/>
                  </form>
                )
              )
            )
          )}            
        </div>
    )
}

export default App