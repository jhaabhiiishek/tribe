import { useEffect, useState } from 'react';
import '../App.css';
import getCookie from './getCookie';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import { useSelector } from 'react-redux';

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const api = axios.create({
    baseURL: 'https://tribe-backend-sl5g.onrender.com/',
});

function Form(e) {
	const [loginusername, setLoginUsername] = useState("");
    const [loginpassword, setLoginPassword] = useState("");
	const [email, setEmail] = useState("");
	const [confPass, setConfPass] = useState("");
	const dispatch = useDispatch()
	const nullCookieState = useSelector(state => state.nullCookie)	
    const actionState = useSelector(state => state.actionArea)
  	const {setNullCookie} = bindActionCreators(actionCreators, dispatch)
	const [pwdChange, setPwdChange] = useState(false)
	const [otp, setOtp] = useState("")
	const [newPass, setNewPass] = useState("")
	const [postText, setPostText] = useState("")
	const [notifications, setNotifications] = useState([])
	const [tribeName, setTribeName] = useState("")
	const [tribeType, setTribeType] = useState("")
	const [tribeLocation, setTribeLocation] = useState("")
	const [tribeTags, setTribeTags] = useState(new Set([]))
	const [inviteMembers, setInviteMembers] = useState(new Set([]))
	const [newMember, setNewMember] = useState('')
	const [newTribeTag, setNewTribeTag] = useState('')
	const [linkRequests, setLinkRequests] = useState([])
	const [tribeInvites, setTribeInvites]= useState([])
	const [name,setName]=useState('')
	const [about,setAbout]=useState('')
	const [dob,setDob]=useState('')
	const [home_city,setHomeCity]=useState('')
	const [college,setCollege]=useState('')
	const [passOutYear,setPassOutYear]=useState('')
	const [course,setCourse]=useState('')
	const [job,setJob]=useState('')
	const [addInterests,setAddInterests]=useState(new Set([])) 
	const [newInterest,setNewInterest]=useState('') 
	const studentCookie= getCookie();

	useEffect(()=>{
		
		if(studentCookie!==undefined){
			setNullCookie(0)
			api.post('/fetch_links',{
				user_id:studentCookie.user_id,
				key:studentCookie.user_id
			}, {
				withCredentials: true,
			}).then(response => {
				if(response.data.success===1){
					setName(response.data.data.name)
					setAbout(response.data.data.about)
					setDob(response.data.data.dob)
					setHomeCity(response.data.data.home_city)
					setCollege(response.data.data.college)
					setPassOutYear(response.data.data.pass_out_year)
					setCourse(response.data.data.course)
					setJob(response.data.data.job)
					setAddInterests(new Set(response.data.data.interests))
				}else{
					
				}
			})
			api.post('/fetch_notifications',{
				user_id:studentCookie.user_id
			}, {
				withCredentials: true,
			}).then(response => {
				if(response.data.success===1){
					setNotifications(response.data.data)
				}else{
					diffToast(response)
				}
			})
			api.post('/fetchlinkrequests',{
				user_id:studentCookie.user_id
			}, {
				withCredentials: true,
			}).then(response => {
				if(response.data.success===1){
					setLinkRequests(response.data.data)
				}else{
					diffToast(response)
				}
			})
			api.post('/fetch_tribe_invites',{
				user_id:studentCookie.user_id
			}, {
				withCredentials: true,
			}).then(response => {
				if(response.data.success===1){
					setTribeInvites(response.data.data)
				}else{
					diffToast(response)
				}
			})			
		}
	},[]) 

	const checkMaxWarning=()=>{
		if(postText.length===1000){
			console.log('max limit reached')
			toast.warning('Max limit reached',{
				position:"bottom-center"
			});
		}
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

	const createPost= async (e)=>{
		e.preventDefault()
		await api.post('/createpost',{
			user_id:studentCookie.user_id,
			text:postText
		}, {
			withCredentials: true,
		}).then(response => {
			diffToast(response)
		});
		setTimeout(()=>{window.location.reload()},2500)
	}
	const createTribePost= async (e)=>{
		e.preventDefault()
		if(postText===''){
			toast.error('Please fill all the fields',{
				position:"bottom-center"
			});
			return
		}
		await api.post('/createtribepost',{
			user_id:studentCookie.user_id,
			text:postText,
			tribe_id:actionState[0].tribe_id
		}, {
			withCredentials: true,
		}).then(response => {
			console.log(response)
			diffToast(response)
		});
		setTimeout(()=>{window.location.reload()},2500)
	}
	const createTribe = async(e)=>{
		e.preventDefault()
		if(tribeName==='' || tribeType==='' || tribeLocation===''){
			toast.error('Please fill all the fields',{
				position:"bottom-center"
			});
			return
		}else{
			await api.post('/createtribe',{
				user_id:studentCookie.user_id,
				name:tribeName,
				tribe_type:tribeType,
				tribe_location:tribeLocation,
				tags:Array.from(tribeTags)
			}, {
				withCredentials: true,
			}).then(async(response) => {
				if(response.data.success===1){
					let memarray=Array.from(inviteMembers)
					let tribe_id=response.data.data.tribe_id
					let check_val = 0;
					for(var i=0;i<inviteMembers.size;i++){
						console.log(memarray[i])
						await api.post('/tribe_invite',{
							user_id:studentCookie.user_id,
							tribe_id:tribe_id,
							receiver_id:memarray[i]
						}, {
							withCredentials: true,
						}).then(response => {
							if(response.data.success===1){
								check_val+=1
							}else{
								console.log(response)
							}
						});
					}
					if(check_val===inviteMembers.size){
						toast.success('Tribe created',{
							position:"bottom-center"
						});
						toast.success('Invited everyone!',{
							position:"bottom-center"
						});
					}else{
						toast.error("Can't invite everyone!",{
							position:"bottom-center"
						});
						toast.success('Tribe created',{
							position:"bottom-center"
						});
					}
				}
				else{
					diffToast(response)
				}
	
			});
			// setTimeout(()=>{window.location.reload()},2500)
			setTribeName('')
			setTribeType('')
			setTribeLocation('')
			setTribeTags(new Set([]))
			setInviteMembers(new Set([]))
			setNewMember('')
			setNewTribeTag('')
		}
	}
	const inviteSubmit = async (e)=>{
		e.preventDefault()
		if(inviteMembers.size>0){
			let memarray=Array.from(inviteMembers)
			let tribe_id=actionState[0].tribe_id
			let check_val = 0;
			for(var i=0;i<inviteMembers.size;i++){
				console.log(memarray[i])
				await api.post('/tribe_invite',{
					user_id:studentCookie.user_id,
					tribe_id:tribe_id,
					receiver_id:memarray[i]
				}, {
					withCredentials: true,
				}).then(response => {
					if(response.data.success===1){
						check_val+=1
					}else{
						console.log(response)
					}
				});
			}
			if(check_val===inviteMembers.size){
				toast.success('Invited everyone!',{
					position:"bottom-center"
				});
				setInviteMembers(new Set([]))
				setNewMember('')
			}else{
				toast.error("Can't invite everyone!",{
					position:"bottom-center"
				});
				setNewMember('')
			}
		}else{
			toast.error('Please enter atleast 1 member',{
				position:"bottom-center"
			});
			return
		}
	}
	const handleRemoveInterest = (interest)=>{
		const updatedInterest = new Set(addInterests)
		updatedInterest.delete(interest)
		setAddInterests(updatedInterest)
	}
	const handleRemoveTag = (tag)=>{
		const updatedInterest = new Set(tribeTags)
		updatedInterest.delete(tag)
		setTribeTags(updatedInterest)
	}
	const handleRemoveMember = (member)=>{
		const updatedInterest = new Set(newMember)
		updatedInterest.delete(member)
		setInviteMembers(updatedInterest)
	}
	const loginSubmit = (e)=>{
		if(loginusername!=="" && loginpassword!==""){
			e.preventDefault();
			api.post('/login',{
			user_id:loginusername,
			password:loginpassword 
			}, {
			withCredentials: true,
			}).then(response => {
			if(response.data.success===1){
				const valueObj = {
					"user_id":response.data.user_id
				}
				const value = JSON.stringify(valueObj)
				Cookies.set("student",value,{ expires: 7 });
				const cookie = getCookie()
				console.log(cookie)
				console.log(nullCookieState)
				
				if(cookie!==undefined){
					setNullCookie(0)
				}
			}
			diffToast(response)
			});
		}
	}

	const changeProfileDetails = async (e)=>{
		e.preventDefault();
		const studentCookie = getCookie()
			await api.post('/editstudentDetails',{
				user_id:studentCookie.user_id,
				new_about:about,
				dob:dob,
				new_home_city:home_city,
				new_college:college,
				new_pass_out_year:passOutYear,
				new_course:course,
				new_job:job,
				additional_interests:Array.from(addInterests)
			}, {
				withCredentials: true,
			}).then(response => {
				diffToast(response)
			});
	}
	const enterStudentProfileDetails = async (e)=>{
		e.preventDefault();
		const studentCookie = getCookie()
			await api.post('/studentDetails',{
				user_id:studentCookie.user_id,
				name:name,
				about:about,
				dob:dob,
				home_city:home_city,
				college:college,
				pass_out_year:passOutYear,
				course:course,
				job:job,
				interests:Array.from(addInterests)
			}, {
				withCredentials: true,
			}).then(response => {
				diffToast(response)
				if(response.data.success==1){
					setTimeout(()=>{
						window.location.reload()
					},2500)
				}
			});
	}

	const sendMail = async(e)=>{
		e.preventDefault();
		const student = getCookie()
		console.log(student)
			const waiting= toast.loading("Please wait...")
			await api.post('/email_otp_change_pwd',{
				email_id:email
			}, {
				withCredentials: true,
			}).then(response => {
				if(response.data.success===1){
					setPwdChange(true)
					toast.update(waiting,{render:response.data.msg,type:"success",isLoading:false})
				}else{
					toast.update(waiting,{render:response.data.msg,type:"error",isLoading:false})
				}
			});
	}

	const closePasswordSubmit = (e)=>{
		e.preventDefault()
		document.getElementById('abruptForms').style.display='none'
		document.body.classList.remove('scrollable-container');
	}

	const closePostSubmit = (e)=>{
		e.preventDefault()
		document.getElementById('abruptPostForms').style.display='none'
		document.body.classList.remove('scrollable-container');
	}
	const addTag = (e)=>{
		e.preventDefault()
		if(newInterest!==''){
			addInterests.add(newInterest)
			setAddInterests(addInterests)
			console.log(addInterests)
			setNewInterest('')
		}
	}
	const addTribeTag = (e)=>{
		e.preventDefault()
		if(newTribeTag!==''){
			tribeTags.add(newTribeTag)
			setTribeTags(tribeTags)
			console.log(tribeTags)
			setNewTribeTag('')
		}
	}
	const addMember = (e)=>{
		e.preventDefault()
		if(newMember!==''){
			inviteMembers.add(newMember)
			setInviteMembers(inviteMembers)
			console.log(inviteMembers)
			setNewMember('')
		}
	}

	const changePasswordSubmit = async(e)=>{
		e.preventDefault()
		const waiting= toast.loading("Please wait...")
		await api.post('/changepassword',{
			email_id:email,
			otp:otp,
			password:newPass
		}, {
			withCredentials: true,
		}).then(async (response) => {
			if(response.data.success===1){
				setPwdChange(false)
				toast.update(waiting,{render:'Password changed Login again',type:"success",isLoading:false})
				setTimeout(async()=>{await api.get('/logout',{
					withCredentials: true
				}).then(response => {
					if(response.data.success===1){
						window.location.reload();
					}else{
						diffToast(response)
					}
				})},2500)
				
			}else{
				toast.update(waiting,{render:response.data.msg,type:"error",isLoading:false})
			}
		});
	}

    if(e.type==='login'){
		return (
			<form>
				<div className='forms'>
				  <label htmlFor="loginusername">Username</label>
				  <input type='text' value={loginusername} onChange={(e) => setLoginUsername(e.target.value)} placeholder='username/email' name='loginusername' required></input>
				  <label htmlFor="loginpassword">Password</label>
				  <input type="password" value={loginpassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter Password" name="loginpassword" required></input>
				  <button onClick={(e)=>loginSubmit(e)} type='submit'>Login</button>
				</div>
				<ToastContainer/>
			</form>
		)
	}else if(e.type==='passChange'){
		return(
			(pwdChange===true)?(
				<form id='abruptForms'>
					<div className='forms'>
						<button id='formCloseBtn' onClick={(e)=>closePasswordSubmit(e)} >X</button>
						<label htmlFor="">Enter OTP</label>
						<input type='text' value={otp} onChange={(e) => setOtp(e.target.value)} placeholder='otp' name='otp' required></input>
						<label htmlFor="">Enter new Password</label>
						<input type='password' value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder='new password' name='new password' required></input>
						<label htmlFor="">Confirm Password</label>
						<input type='password' value={confPass} onChange={(e) => setConfPass(e.target.value)} placeholder='confirm password' name='confirm password' required></input>
						<button onClick={(e)=>changePasswordSubmit(e)} >Submit</button>
					</div>
					<ToastContainer/>
				</form>
			):(
				<form id='abruptForms'>
					<div className='forms'>
						<button id='formCloseBtn' onClick={(e)=>closePasswordSubmit(e)} >X</button>
						<label htmlFor="">Enter your Email</label>
						<input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email' name='email' required></input>
						<button onClick={(e)=>sendMail(e)} >Submit</button>
					</div>
					<ToastContainer/>
				</form>
			)
		)
	}else if(e.type==='editProfile'){
		
		return(
			<form id='abruptForms'>
				<div className='forms' style={{marginTop:'2.5%'}}>
					<button id='formCloseBtn' onClick={(e)=>closePasswordSubmit(e)} >X</button>
					<div style={{display:"inline"}}>
						<label htmlFor="">Name</label>
						<input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='name' name='name' required></input>
					</div>
					<div>
						<label htmlFor="">About</label>
						<input type='text' value={about} onChange={(e) => setAbout(e.target.value)} placeholder='about' name='about' required></input>
					</div>
					<div>
						<label htmlFor="">D.o.B</label>
						<input type='date' value={(dob)} onChange={(e) => setDob(e.target.value)} placeholder='date of birth' name='dob' required></input>
					</div>
					<div>
						<label htmlFor="">City</label>
						<input type='text' value={home_city} onChange={(e) => setHomeCity(e.target.value)} placeholder='city' name='city' required></input>
					</div>
					<div>
						<label htmlFor="">College</label>
						<input type='text' value={college} onChange={(e) => setCollege(e.target.value)} placeholder='college name' name='college' required></input>
					</div>
					<div>
						<label htmlFor="">Pass out</label>
						<input type="number" min="1900" max="2099" step="1" value={passOutYear} onChange={(e) => setPassOutYear(e.target.value)} placeholder='pass out year' name='pass out year' required></input>
					</div>
					<div>
						<label htmlFor="">Course</label>
						<input type='text' value={course} onChange={(e) => setCourse(e.target.value)} placeholder='course' name='course' required></input>
					</div>
					<div>
						<label htmlFor="">Job Title</label>
						<input type='text' value={job} onChange={(e) => setJob(e.target.value)} placeholder='job' name='job' required></input>
					</div>
					<div>
						<label htmlFor="">Interests</label>
						<input type='text' value={newInterest} onChange={(e) => setNewInterest(e.target.value)} placeholder='add a tag' name='tag' required></input>
						<button onClick={(e)=>addTag(e)} >add</button>
					</div>
					<div id='profile-main-div' className='search-result box-shadow'>
						{(addInterests.size>0)&&([...addInterests].map((interest)=>{
							return(
								<div className='profile-tags box-shadow' style={{display:'inline-block',backgroundColor:'rgb(0, 0, 0)',color: 'white',position:'relative'}}>
									<button className='removeInterest'  onClick={(e)=>{e.preventDefault();handleRemoveInterest(interest)}}>X</button>
									{/* <img className='icon-imgs' alt='(interests)' src={process.env.PUBLIC_URL+"/hashtag.png"}/> */}
									#{interest}
								</div>
							)
						}))}
					</div>
					<button onClick={(e)=>changeProfileDetails(e)} >Submit</button>
				</div>
				<ToastContainer/>
			</form>
		)
	}else if(e.type==='enterStudentDetails'){
		
		return(
			<form id='abruptForms'>
				<div className='forms' style={{marginTop:'2.5%'}}>
					{/* <button id='formCloseBtn' onClick={(e)=>closePasswordSubmit(e)} >X</button> */}
					<div style={{display:"inline"}}>
						<label htmlFor="">Name</label>
						<input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='name' name='name' required></input>
					</div>
					<div>
						<label htmlFor="">About</label>
						<input type='text' value={about} onChange={(e) => setAbout(e.target.value)} placeholder='about' name='about' required></input>
					</div>
					<div>
						<label htmlFor="">D.o.B</label>
						<input type='date' value={(dob)} onChange={(e) => setDob(e.target.value)} placeholder='date of birth' name='dob' required></input>
					</div>
					<div>
						<label htmlFor="">City</label>
						<input type='text' value={home_city} onChange={(e) => setHomeCity(e.target.value)} placeholder='city' name='city' required></input>
					</div>
					<div>
						<label htmlFor="">College</label>
						<input type='text' value={college} onChange={(e) => setCollege(e.target.value)} placeholder='college name' name='college' required></input>
					</div>
					<div>
						<label htmlFor="">Pass out</label>
						<input type="number" min="1900" max="2099" step="1" value={passOutYear} onChange={(e) => setPassOutYear(e.target.value)} placeholder='pass out year' name='pass out year' required></input>
					</div>
					<div>
						<label htmlFor="">Course</label>
						<input type='text' value={course} onChange={(e) => setCourse(e.target.value)} placeholder='course' name='course' required></input>
					</div>
					<div>
						<label htmlFor="">Job Title</label>
						<input type='text' value={job} onChange={(e) => setJob(e.target.value)} placeholder='job' name='job' required></input>
					</div>
					<div>
						<label htmlFor="">Interests</label>
						<input type='text' value={newInterest} onChange={(e) => setNewInterest(e.target.value)} placeholder='add a tag' name='tag' required></input>
						<button onClick={(e)=>addTag(e)} >add</button>
					</div>
					<div id='profile-main-div' className='search-result box-shadow'>
						{(addInterests.size>0)&&([...addInterests].map((interest)=>{
							return(
								<div className='profile-tags box-shadow' style={{display:'inline-block',backgroundColor:'rgb(0, 0, 0)',color: 'white',position:'relative'}}>
									<button className='removeInterest'  onClick={(e)=>{e.preventDefault();handleRemoveInterest(interest)}}>X</button>
									{/* <img className='icon-imgs' alt='(interests)' src={process.env.PUBLIC_URL+"/hashtag.png"}/> */}
									#{interest}
								</div>
							)
						}))}
					</div>
					<button onClick={(e)=>enterStudentProfileDetails(e)} >Submit</button>
				</div>
				<ToastContainer/>
			</form>
		)
	}else if(e.type==='createPost'){
		
		return (
			<form id='abruptPostForms'>
				<div className='forms'>
					<button id='formCloseBtn' onClick={(e)=>closePostSubmit(e)} >X</button>
					<label >{studentCookie.user_id}</label>
					<textarea onKeyDown={()=>checkMaxWarning()} maxLength='1000' minLength='1' type='text' value={postText} onChange={(e) => setPostText(e.target.value)} placeholder='Compose your post!' style={{width:'80%',height:'250px',resize:'none'}} name='postText' required></textarea>
					<button onClick={(e)=>createPost(e)} type='submit'>Create</button>
				</div>
				<ToastContainer/>
			</form>
		)
	}else if(e.type==='createTribe'){
		
		return (
			<form id='abruptPostForms'>
				<div className='forms' style={{marginTop:'2.5%'}}>
					<button id='formCloseBtn' onClick={(e)=>closePostSubmit(e)} >X</button>
				  	<label htmlFor="tribeName">Tribe name</label>
				 	<input type='text' value={tribeName} onChange={(e) => setTribeName(e.target.value)} placeholder='enter tribe name' name='tribeName' required></input>
				  	<label htmlFor="tribeType">Type</label>
				 	<input type='text' value={tribeType} onChange={(e) => setTribeType(e.target.value)} placeholder='max 3 words (50 char)' name='tribeType' required></input>
				  	<label htmlFor="tribeLocation">Location</label>
				 	<input type='text' value={tribeLocation} onChange={(e) => setTribeLocation(e.target.value)} placeholder='city name' name='tribeType' required></input>
					<label htmlFor="">Interests</label>
					<input type='text' value={newTribeTag} onChange={(e) => setNewTribeTag(e.target.value)} placeholder='add a tag' name='tag'></input>
					<button onClick={(e)=>addTribeTag(e)} >add</button>
					<div id='profile-main-div' className='search-result box-shadow'>
						{(tribeTags.size>0)&&([...tribeTags].map((tag)=>{
							return(
								<div className='profile-tags box-shadow' style={{display:'inline',backgroundColor:'rgb(0, 0, 0)',color: 'white',position:'relative'}}>
									<button className='removeInterest'  onClick={(e)=>{e.preventDefault();handleRemoveTag(tag)}}>X</button>
									<img className='icon-imgs' alt={tag} src={process.env.PUBLIC_URL+"/hashtag.png"}/>{tag}
								</div>
							)
						}))}
					</div>
					<label htmlFor="">Invite members</label>
					<input type='text' value={newMember} onChange={(e) => setNewMember(e.target.value)} placeholder='invite username' name='invite username'></input>
					<button onClick={(e)=>addMember(e)} >invite</button>
					<div id='profile-main-div' className='search-result box-shadow'>
						{(inviteMembers.size>0)&&([...inviteMembers].map((member)=>{
							return(
								<div className='profile-tags box-shadow' style={{display:'inline',backgroundColor:'rgb(0, 0, 0)',color: 'white',position:'relative'}}>
									<button className='removeInterest'  onClick={(e)=>{e.preventDefault();handleRemoveMember(member)}}>X</button>
									<img className='icon-imgs' alt={member} src={process.env.PUBLIC_URL+"/circle.png"}/>{member}
								</div>
							)
						}))}
					</div>


				 	<button onClick={(e)=>createTribe(e)} type='submit'>create</button>
				</div>
				<ToastContainer/>
			</form>
		)
	}else if(e.type==='tribePost'){
		return (
			<form id='abruptPostForms'>
				<div className='forms' style={{marginTop:'2.5%'}}>
					<button id='formCloseBtn' onClick={(e)=>closePostSubmit(e)} >X</button>
					<label >{studentCookie.user_id}</label>
					<textarea onKeyDown={()=>checkMaxWarning()} maxLength='1000' minLength='1' type='text' value={postText} onChange={(e) => setPostText(e.target.value)} placeholder='Compose your post!' style={{width:'80%',height:'250px',resize:'none'}} name='postText' required></textarea>
					<button onClick={(e)=>createTribePost(e)} type='submit'>Tribe Compose</button>
				</div>
				<ToastContainer/>
			</form>
		)
	}else if(e.type==='notifications'){
		const acceptlinkrequest =async(e,linkRequest)=>{
			e.preventDefault()
			await api.post('/acceptlinkrequest',{
				user_id:studentCookie.user_id,
				sender_user_id:linkRequest.sender_user_id
			}, {
				withCredentials: true,
			}).then(response => {
				diffToast(response.data.msg)
				console.log(response)
			});
			// setTimeout(()=>{window.location.reload()},2500)
		}
		const rejectlinkrequest = async(e,linkRequest)=>{
			e.preventDefault()
			await api.post('/rejectlinkrequest',{
				user_id:studentCookie.user_id,
				sender_user_id:linkRequest.sender_user_id
			}, {
				withCredentials: true,
			}).then(response => {
				diffToast(response)
			});
		}
		const responsetriberequest = async(e,invite,responseToinvite)=>{
			e.preventDefault()
			console.log(studentCookie.user_id,responseToinvite,invite._id)
			await api.post('/response_tribe_invites',{
				user_id:studentCookie.user_id,
				response_to_invite:responseToinvite,
				tribe_invite_id:invite._id
			}, {
				withCredentials: true,
			}).then(response => {
				console.log(response)
				linkRequests.filter(n=>n!= invite)
				diffToast(response)
			});
		}
		return (
			<form id='abruptForms'>
				<div className='forms' style={{marginTop:'2.5%'}}>
					<button id='formCloseBtn' onClick={(e)=>closePasswordSubmit(e)} >X</button>
					<label htmlFor="">Your Notifications</label>
					{notifications!==null&&notifications.map((notification) => {
						return(
							<div className='notification'>
								<div className='notification-text'>
									{notification}
								</div>
							</div>
						)
					})}
					{tribeInvites!==null&&tribeInvites.map((invite) => {
						return(
							<div className='notification'>
								<div className='notification-text'>
									{invite.sender} invited you to join {invite.tribe_name} at {new Date(invite.sent_at).toLocaleString()}
								</div>
								<div className="notification-actions">
									<button className='notification-btn' onClick={(e)=>responsetriberequest(e,invite,"true")}>Accept</button>
									<button className='notification-btn' onClick={(e)=>responsetriberequest(e,invite,"false")}>Reject</button>
								</div>
							</div>
						)
					})}
					{linkRequests!==null&&linkRequests.map((linkRequest) => {
						return(
							<div className='notification'>
								<div className='notification-text'>
									{linkRequest.sender_user_id} sent you a link request at {new Date(linkRequest.sent_at).toLocaleString()}
								</div>
								<div className="notification-actions">
									<button className='notification-btn' onClick={(e)=>acceptlinkrequest(e,linkRequest)}>Accept</button>
									<button className='notification-btn' onClick={(e)=>rejectlinkrequest(e,linkRequest)}>Reject</button>
								</div>

							</div>
						)
					})}
					{/* {linkRequests===null && tribeInvites===null &&<div className='search-result box-shadow'>No notifications</div>} */}
				</div>
				<ToastContainer/>
			</form>
		)
	}else if(e.type==="inviteMembers"){
		return (
			<form id='abruptPostForms'>
				<div className='forms' style={{marginTop:'2.5%'}}>
					<button id='formCloseBtn' onClick={(e)=>closePostSubmit(e)} >X</button>
					<label htmlFor="">Invite members</label>
					<input type='text' value={newMember} onChange={(e) => setNewMember(e.target.value)} placeholder='invite username' name='invite username'></input>
					<button onClick={(e)=>addMember(e)} >add</button>
					<div id='profile-main-div' className='search-result box-shadow'>
						{(inviteMembers.size>0)&&([...inviteMembers].map((member)=>{
							return(
								<div className='profile-tags box-shadow' style={{display:'inline',backgroundColor:'rgb(0, 0, 0)',color: 'white',position:'relative'}}>
									<button className='removeInterest'  onClick={(e)=>{e.preventDefault();handleRemoveMember(member)}}>X</button>
									<img className='icon-imgs' alt={member} src={process.env.PUBLIC_URL+"/circle.png"}/>{member}
								</div>
							)
						}))}
					</div>
					<button onClick={(e)=>inviteSubmit(e)} type='submit'>invite</button>
				</div>
			</form>
		)
	}
}

export default Form