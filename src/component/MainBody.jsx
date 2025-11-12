import { useEffect, useState,useRef } from 'react';
import '../App.css';
import '../circle.scss'
import axios from 'axios';
import getCookie from './getCookie';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostBody from './PostBody'
import { useSelector } from 'react-redux';
import Profile from './Profile'
import PostParent from './PostParent'
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import TribePosts from './TribePosts';
import MultiProfile from './MultiProfile';
import MultiTribe from './MultiTribe';
import Form from './Form';
import Cookies from 'js-cookie';
import SelectionPost from './selectionPost';
import { setLoadingAnimation } from '../state/action-creators';
import { RiNotification3Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import { MdPassword } from "react-icons/md";
import { TfiMenuAlt } from "react-icons/tfi";
import { CgMenuOreos } from "react-icons/cg";
import { FaUser } from "react-icons/fa";

import api from './api';

function MainBody({toggleNav}) {
	const [nullCookie, setNullCookie] = useState(true);
	const [profileName, setProfileName] = useState('');
	const [posts, setPosts] =useState([])
	const [value, setValue] = useState('')
	const [searchData, setSearchData] = useState([])
	const [otherPosts, setOtherPosts] = useState([])
	const [formType, setFormType] = useState('')
	const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [classToDisplay,setClass] = useState('')
    const [disRightNav,setDisRightNav] = useState(false)

    const dispatch = useDispatch()
	const actionState = useSelector(state => state.actionArea)
	const isComponentLoading = useSelector(state => state.isComponentLoading)
	const selfPost = useSelector(state => state.selfPost)
	const {userProfileClick,otherClicks,setSelectedPost,setUserPostsVisibility} = bindActionCreators(actionCreators, dispatch)
	const selectedPost = useSelector(state=>state.selectedPost)


    var heading = "Posts"
    const student = getCookie()
    heading=student.user_id+" posts"


	const onChange = (e) => {
		setValue(e.target.value)
	
	}

	const fetchPosts=(user_id_for_search)=>{
		api.post('/fetch_user_post',{
			user_id:user_id_for_search
		},{
			withCredentials: true
		}).then(response => {
			if(response.data.success===1){
				const newPosts = response.data.data[0].map((post,index)=>(
					<PostBody keyValue={index} data={response.data.data[0][index]}/>
				))
				setPosts(newPosts)
			}else{
				couldntFetch(response)
			}
		})
	}
	

	const logOut=async()=>{
		Cookies.remove("student")
		await api.get('/logout',{
			withCredentials: true
		}).then(response => {
			if(response.data.success===1){
				window.location.reload();
			}else{
				couldntFetch(response)
			}
		})
	} 

	const couldntFetch = (msg)=>{
		toast.success(msg.data.msg,{
			position:"bottom-center"
		});
	}

	useEffect(()=>{
			const studentCookie= getCookie();
			if(studentCookie!==undefined){
				setProfileName(studentCookie.user_id)
				setNullCookie(false)
				api.post('/fetch_links',{
					user_id:studentCookie.user_id,
					key:studentCookie.user_id
				}, {
					withCredentials: true,
				}).then(response => {
					if(response.data.success===1){
						if(response.data.msg=="Student doesn't exist"){
							setFormType("enterStudentDetails")
						}
					}else{
						toast.error("An error occured",{position:"bottom-center"})
					}
				})
				fetchPosts(student.user_id)
			}
			const handleResize=()=>{
				setScreenWidth(window.innerWidth)
			}
			window.addEventListener("resize", handleResize);
			if(screenWidth<800){
				setClass("hide")
			}else{
				setClass("")
			}
			return () => {
				window.removeEventListener("resize", handleResize);
			};
	},[])
	
	const onSearch = (searchTerm) => {
		setSelectedPost([])
		userProfileClick([])
		setLoadingAnimation(1)
		setUserPostsVisibility(0)
		api.post('/search',{
			user_id:student.user_id,
			key:searchTerm,
			noOfValues:20
		},{
			withCredentials: true
		}).then(response => {
			if(response.data.success===1){
				// setSearchData(response.data.data)
				var emptyArray = []
				console.log(response.data.data)
				emptyArray.push(response.data.data)
				userProfileClick(emptyArray)
				setLoadingAnimation(0)
			}else{
				couldntFetch(response)
			}
		})
		// const handleFriendsViewAll=()=>{
		// 	if(studentCookie!==undefined){
		// 		api.post('/fetch_all_links_of',{
		// 			user_id:studentCookie.user_id,
		// 			key:studentCookie.user_id
		// 		},{
		// 			withCredentials: true
		// 		}).then(response => {
		// 		})
		// 	}
		// }
	} 
	const handleChangeClick = (e)=>{
		document.body.classList.add('scrollable-container');
		if(document.getElementById('abruptForms')){
			document.getElementById('abruptForms').style.display='block'
		}
		if(e.target.id==='edit-password'){
			setFormType('passChange')
		}else if(e.target.id==='edit-profile'){
			setFormType('editProfile')
		}else if(e.target.id==='notif-img'||e.target.id==='notifications'){
			setFormType('notifications')
		}
	}

	const mobileActionButtons=(e)=>{
		if(e.target.id==="main-menu-icon"){
			const navbar = document.getElementById("nav")
			console.log(navbar.style.display)
			if(navbar.classList.contains("hide-in-mobile")){
				console.log("here check 2")
				document.body.classList.add('scrollable-container');
				navbar.classList.remove("hide-in-mobile")
				navbar.classList.remove("hide")
			}else{
				console.log("here check 3")
				document.body.classList.remove('scrollable-container');
				navbar.classList.add("hide")
			}
		}else if(e.target.id==="settings-img"){
			const profileEditDiv = document.getElementById("profile-settings")
			if(profileEditDiv.classList.contains("hide")){
				document.body.classList.add('scrollable-container');
				profileEditDiv.classList.remove("hide")
			}else{
				document.body.classList.remove('scrollable-container');
				profileEditDiv.classList.add("hide")
			}
		}
	}

	const backKey = ()=>{
		console.log(selectedPost)
		setSelectedPost([])
		console.log(selectedPost)
	}
	const handleSelfClick = (e)=>{
		if(selfPost==0){
			userProfileClick([])
			const studentCookie= getCookie();
			if(studentCookie!==undefined){

				api.post('/fetch_links',{
					user_id:studentCookie.user_id,
					key:studentCookie.user_id
				},{
					withCredentials: true
				}).then(response => {
					var emptyArray = []
					emptyArray.push(response.data.data)
					setUserPostsVisibility(1)
					userProfileClick(emptyArray)
					setLoadingAnimation(0)
				})
			}
		}
    }

    return (
        <div id='main-body'>
			{/* <div id="mobile-main-nav">
				<img  className='box-shadow' onClick={(e)=>mobileActionButtons(e)} src={process.env.PUBLIC_URL+'/menu.png'} id='menu-img' alt='menu-icon'/>
				<h1 id='branding-mobile' onClick={()=>{
					userProfileClick([])
					setSelectedPost([])
					setLoadingAnimation(1)
					setUserPostsVisibility(0)
				}}>TribeIn</h1>
				<img  className='box-shadow' onClick={(e)=>mobileActionButtons(e)} src={process.env.PUBLIC_URL+'/settings.png'} id='settings-img' alt='settings-icon'/>
			</div> */}
			<div id='main-body-nav'>
				<TfiMenuAlt id='main-menu-icon' onClick={toggleNav} style={{backgroundColor:'white',color:'black',borderRadius:'5px',marginRight:'1.5%'}}/>
				<form id='search-bar'>
					<input id='search-input' className='box-shadow' placeholder="Search for..." value={value} onChange={onChange} type="text"/>
					<div id='search-submit' className='box-shadow' type="submit" onClick={()=>onSearch(value)} >Search</div>
					<div id='search-dropdown'>
						{searchData.map((item)=>(
							<div className='search-result box-shadow'>{item.name+' ('+item.user_id+')'}</div>
						))}
					</div>
					<CgMenuOreos id='pro-menu-icon' onClick={()=>{setDisRightNav(!disRightNav)}} style={{backgroundColor:'white',color:'orange',borderRadius:'5px',fontSize:'x-large',marginLeft:'1.5%'}}/>
				</form>
				{/* <button onClick={() => window.open("/chat", "_self")}>
					Open Chat
				</button> */}
				<div id='profile-btn' onClick={()=>{
					setLoadingAnimation(1)
					handleSelfClick()
					setSelectedPost([])
				}} ><FaUser color='black' style={{marginRight:'5%'}}/> <div class='hide-in-mobile'>{profileName}</div></div>
			</div>
			<div id='play-area'>
				<div id='action-center'>
				{isComponentLoading?(
						<div id='spin-container'>
							<svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
								<circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
							</svg>
						</div>
					):(
						<>
							<div id='ac-head'>
								{(selectedPost.length>0)?(
									<div onClick={()=>backKey()} style={{display:"inline",marginRight:"2.5%"}}>
										<img alt='(interests)' onClick={()=>backKey()}  src={process.env.PUBLIC_URL+"/back-square-svgrepo-com.svg"}/>
									</div>
								):(
									<></>
								)}
								<h1 className='subgroup-heading' style={{ fontSize:'x-large'}}>{actionState.length==0?('Posts'):('Profile')}</h1>
							</div>
							{(selectedPost.length>0)?(
								<SelectionPost/>
							):(
								(selfPost==0)?((actionState.length==0)?(
									(posts.length>0)?(posts):(<div className='search-result box-shadow'>Make connections to see posts</div>)
									):((actionState[0].tribe_id==null||actionState[0].tribe_id==undefined)?(
										(actionState[0][0]&&(actionState[0][0].user_id!==undefined&&actionState[0][0].user_id!==null))?(
									<>
										<MultiProfile/>
									</>):((actionState.length>0 && actionState[0].user_id!=null && actionState[0].user_id!=undefined)?(
											<>
												<Profile/>
												<PostParent user_id={actionState[0].user_id}/>
											</>
										):(
											<div className='search-result box-shadow'>No results match your search</div>
										)
										
									)
								):((actionState[1]&&(actionState[1].tribe_id!==undefined&&actionState[1].tribe_id!==null))?(
									<>
									<MultiTribe/>
									{console.log(actionState[1].tribe_id)}
									</>
								):(
									<>
										<Profile/>
										<TribePosts/>
									</>
								)
								
								))):(
									<>
										<Profile/>
										<PostParent user_id={student.user_id}/>
									</>
							)
							)}
						</>
					)}
					
				</div>
				<div id='profile-settings' className={`profile-settings ${disRightNav ? 'open-in-mobile' : 'hide-in-mobile'}`}>
					<CgMenuOreos id='pro-menu-icon' onClick={()=>{setDisRightNav(!disRightNav)}} style={{backgroundColor:'white',color:'orange',borderRadius:'5px',fontSize:'x-large',marginLeft:'auto',marginRight:'5%'}}/>
					<div onClick={(e)=>handleChangeClick(e)} className='profile-changes-btn box-shadow'id='edit-password'><MdPassword style={{marginRight:"6%",width:"1.2em",height:"1.2em"}}/>Edit password</div>
					<div onClick={(e)=>handleChangeClick(e)} className='profile-changes-btn box-shadow'id='edit-profile'><BiEdit style={{marginRight:"6%",width:"1.2em",height:"1.2em"}}/>Edit Profile</div>
					<div className='profile-changes-btn box-shadow' onClick={(e)=>handleChangeClick(e)} id='notif-img'><RiNotification3Line style={{marginRight:"6%",width:"1.2em",height:"1.2em"}}/> Notifications</div>
					<div onClick={logOut} id='logout-btn' className='box-shadow'>Logout</div>
				</div>
				{formType===''?(''):(<Form type={formType}/>)}
			</div>
		</div>
    )
}

export default MainBody