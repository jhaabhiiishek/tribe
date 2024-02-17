import '../App.css';
import React, { useState, useEffect } from 'react';
import Island from './Island';
import Navbar from './Navbar';
import LeftContainer from './LeftContainer';
import MainBody from './MainBody';
import RightContainer from './RightContainer'
import axios from 'axios';
import getCookie from './getCookie';
import Form from './Form';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AWS from 'aws-sdk';
import {v4} from "uuid";
import GLogin from './Glogin';

import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import { useSelector } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoadingAnimation from './LoadingAnimation';


const client_id = "128331685413-1rh7e21p5hfq813q7i0j5rs639e8ckpg.apps.googleusercontent.com"
const api = axios.create({
  baseURL: 'https://tribe-backend-sl5g.onrender.com/',
});
function App() {

    const [loading, setLoading] = useState(true);
    const [emailVerified, setEmailVerified] = useState(true);
    const [signup, setSignup] = useState(false);
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
	  const [formType, setFormType] = useState('')
    const [username, setUsername] = useState("");
    const [loginusername, setLoginUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loginpassword, setLoginPassword] = useState("");
    const [emailOtpVerify, setOtpVerify] = useState(false);
    const [text,setText] = useState('')
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileBaseName,setFileBaseName] =useState("")
    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);



    const dispatch = useDispatch()
	  const nullCookieState = useSelector(state => state.nullCookie)
    const likedPosts = useSelector(state=> state.likedPosts)
    const {setNullCookie,setLikedPosts,setConnectedUsers,setSentRequests} = bindActionCreators(actionCreators, dispatch)

  useEffect(()=>{
    const studentCookie= getCookie();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // set the time for the animation to display
    // console.log(nullCookieState)
    if(studentCookie!==undefined){
      setNullCookie(0)
      setLikedPostsfn()
      setSentRequestsfn()
      setConnectedUsersfn()
      return () => clearTimeout(timer);
    }
  }, []) 

  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    setNullCookie(0)
  }

  const diffToast = (msg)=>{
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
      if(response.data.success===1){
        setOtpVerify(true)
        setEmailVerified(false)
      }
      diffToast(response)
    });
  }

  const signup_sub= async function(){
    if(confirmPassword===password){
      await api.post('/signup',{
        // phone:phone,
        email:email,
        user_id:username,
        password:password 
      }).then(response => {
        if(response.data.success==1){
          setSignup(false)
        }
        diffToast(response)
      });
    }else{
      toast.error("passwords do not match")
    }
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    const user_id = getCookie().user_id
  };

  const createPost = (e)=>{
    e.preventDefault()
    // if(selectedFile==null) return
    // console.log(selectedFile)

    const user_id = getCookie().user_id

    // const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'))
    // const namePart = selectedFile.name.substring(0,selectedFile.name.lastIndexOf('.'))
    // var rand = v4()
    // const final_name = ""+namePart+rand+ext;
    // setFileBaseName(final_name);
    // console.log(fileBaseName);
    // console.log(selectedFile)

    // const data = new FormData()
    // data.append("file",selectedFile)
    // data.append("user_id",user_id)

    // console.log(data)


    // Below code for file uploading to AWS S3 bucket

    // api.post('/uploadSingleFile',data,{
    //   withCredentials: true,
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // }).then(response => {
    //   console.log(response)
    //   if(response.data.success===1){
    //     console.log('Success!!!!')
    //     console.log("fileURL = "+response.data.fileUrl)
    //     setImgUrl(response.data.fileUrl)
    //     console.log("imgURL = "+imgUrl)
    //     api.post('/createpost',
    //     {
    //       user_id:user_id,
    //       text:text,
    //       media_link:response.data.fileUrl
    //     },{
    //       withCredentials: true,
    //     }).then(response => {
    //       console.log(response)
    //       if(response.data.success===1){
    //         console.log('Successfully created post!')
    //       }
    //       diffToast(response)
    //     });
    //   }
    // });


    // const uploadTask = uploadBytesResumable(imageRef, selectedFile);

    // console.log(uploadTask)
    // try{
    //   uploadTask.on("state_changed",
    //     (snapshot) => {
    //       const progress =
    //         Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    //       setProgresspercent(progress);
    //     },
    //     (error) => {
    //       alert(error);
    //     },
    //     () => {
    //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //         setImgUrl(downloadURL)
    //       });
    //     }
    //   );
    // }catch(e){
    //   console.log(e)
    // }
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
          setNullCookie(0)
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
    toast.info(msg,{
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
    e.preventDefault()
    api.post('/verify_otp',{
      email_id:email,
      otp:otp
    }).then(response => {
      if(response.data.success==1){
        setEmailVerified(true);
        setSignup(true);
      }
      diffToast(response)
    });
  }
  const otpSubmit =(e)=>{
    if(email!==""){
      otp_sub(e)
    }
  }

  const handleChangeClick = (e)=>{
		document.body.classList.add('scrollable-container');
		if(document.getElementById('abruptForms')){
			document.getElementById('abruptForms').style.display='block'
		}
		if(e.target.innerHTML==='Change Password'){
      console.log("daba tojh hi")
			setFormType('passChange')
		}else if(e.target.innerHTML==='Edit Profile'){
			setFormType('editProfile')
		}else if(e.target.id==='notif-img'||e.target.id==='notifications'){
			setFormType('notifications')
		}
	}

  // const posts = async()=>{
  //   axios.post('/fetch_user_post',{

  //   })
  // }
  
  const setLikedPostsfn =async()=>{
    const student = getCookie()
    await api.post('/fetch_upvotes_of_user',{
      user_id:student.user_id
    }, {
        withCredentials: true,
    }).then(response => {
      // console.log(response.data.data)
      setLikedPosts(response.data.data)
    });
  }

  const setConnectedUsersfn =async()=>{
    const student = getCookie()
    await api.post('/fetch_links',{
      user_id:student.user_id,
      key:student.user_id
    }, {
      withCredentials: true,
    }).then(response => {
      // console.log(response.data.data.links)
      setConnectedUsers(response.data.data.links)
    });
  }
  const setSentRequestsfn =async()=>{
    const student = getCookie()
    await api.post('/fetchsentrequests',{
      user_id:student.user_id
    }, {
        withCredentials: true,
    }).then(response => {
      // console.log(response.data.data)
      setSentRequests(response.data.data)
    });
  }
    
    return (
      <GoogleOAuthProvider clientId={client_id} >
        <div id='app'>
            {loading?(
                <div className="loading-animation">
                  <LoadingAnimation/>
                </div>
            ):(
              nullCookieState==0?(
                // <div className='blur' id='compose'>
                //     <form id='create-post'>
                //         <h3 id='create-post-header'>Create Your Post</h3>
                //         <input type='text' id='post-input' required onChange={(e)=>setText(e.target.value)} value={text} placeholder='Add text...'></input>
                //         {/* <input id='media-input' type='file' name/</form>='userImage' onChange={(e)=>handleFileChange(e)}></input> */}
                //         {/* {uploadProgress > 0 &&(<p>Upload progress: {uploadProgress}%</p>)} */}
                //         <button type='submit' onClick={(e)=>createPost(e)} id='submit-post'>Post</button>
                //         {
                //           !imgUrl &&
                //           <div className='outerbar'>
                //             <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
                //           </div>
                //         }
                //         {
                //           imgUrl &&
                //           <img src={imgUrl} alt='uploaded file' height={200} />
                //         }
                //     </form>
                //     <ToastContainer/>
                // </div>
                <div id='body-div'>
                  <Navbar/>
                  <MainBody/>
                </div>
            ):
            (
              emailVerified?(
                signup?(
                  <div className='forms'>
                    <label htmlFor="email">Email-id</label>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter a username' name='username'></input>
                    <input type='email' value={email} onChange={(e) => setEmailVerified(e.target.value)} placeholder='Enter email' name='email'></input>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter password' name='password'></input>
                    <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm password' name='confirmpassword'></input>
                    <button onClick={signup_sub} type='submit'>Sign Up</button>
                    <a onClick={()=>setSignup(false)}>Login instead</a>
                    <GLogin/>
                    <ToastContainer/>
                  </div>
                ):(
                  <div style={{display:'flex',flexDirection:'column'}}>
                    {formType===''?(''):(<Form type={formType}/>)}
                    <Form type="login"/>
                    <div id='login-div-options' style={{display:'flex',flexDirection:'row',justifyContent:"center",alignItems:"center",marginTop:"2.5%"}}>
                      <a onClick={()=>setEmailVerified(false)} style={{border:" 1px solid black",backgroundColor: "rgba(0,255,255,0.1)",borderRadius:"14px",marginRight: "4%",padding: "1.5% 3%"}}>Sign up</a>
                      <a onClick={(e)=>handleChangeClick(e)} style={{border:" 1px solid black",backgroundColor: "rgba(0,255,255,0.1)",borderRadius:"14px",marginRight: "4%",padding: "1.5% 3%"}}>Change Password</a>
                      <GLogin/>
                    </div>
                  </div>
                )
              ):(
                emailOtpVerify?(
                  <form>
                    <div className='forms'>
                      <label htmlFor="email">E-mail</label>
                      <input type='text' placeholder='Enter email' name='email' required value={email} onChange={(e) => setEmail(e.target.value)}></input>
                      <input type='text' placeholder='Enter OTP' name='otp' required value={otp} onChange={(e) => setOtp(e.target.value)}></input>
                      <button onClick={(e)=>otpSubmit(e)} type='submit'>Verify Otp</button>
                    </div>
                    <ToastContainer/>
                  </form>
                ):(
                  <form>
                    <div className='forms'>
                      <label htmlFor="email">E-mail</label>
                      <input type='text' placeholder='Enter email' name='email' required value={email} onChange={(e) => setEmail(e.target.value)}></input>
                      <button onClick={emailSubmit} type='submit'>Verify Email</button>
                      <a onClick={loginfromemail}>Login instead</a>
                      <GLogin/>
                    </div>
                    <ToastContainer/>
                  </form>
                )
              )
            )
          )}            
        </div>
      </GoogleOAuthProvider>
    )
}

export default App

// How to send a file to the server using axios


// const handleFileChange = (e) => {
//   const file = e.target.files[0];
//   const formData = new FormData();
//   formData.append('userImage', file);
//   axios.post('/upload', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     },
//     onUploadProgress: (progressEvent) => {
//       const { loaded, total } = progressEvent;
//       const percent = Math.floor((loaded * 100) / total);
//       setUploadProgress(percent);
//     }
//   })
//     .then((res) => {
//       console.log(res);
//       setImgUrl(res.data.fileUrl);
//     })
//     .catch((err) => console.log(err));
// };

