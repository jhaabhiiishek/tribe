import { useEffect, useState,useRef } from 'react';
import '../App.css';
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
import SelectionPost from './selectionPost';

const api = axios.create({
    baseURL: 'https://tribe-backend-sl5g.onrender.com/',
});


function MainBody(e) {
	const [nullCookie, setNullCookie] = useState(true);
	const [profileName, setProfileName] = useState('');
	const [posts, setPosts] =useState([])
	const [value, setValue] = useState('')
	const [searchData, setSearchData] = useState([])
	const [otherPosts, setOtherPosts] = useState([])
	const [formType, setFormType] = useState('')
	const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [classToDisplay,setClass] = useState('')

    const dispatch = useDispatch()
	const actionState = useSelector(state => state.actionArea)
	const selfPost = useSelector(state => state.selfPost)
	const {userProfileClick,otherClicks,setSelectedPost,setUserPostsVisibility} = bindActionCreators(actionCreators, dispatch)
	const selectedPost = useSelector(state=>state.selectedPost)


    var heading = e.heading;
    heading = "Posts"
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
	

	const logOut=()=>{
		api.get('/logout',{
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
			}
			fetchPosts(student.user_id)
			const handleResize=()=>{
				setScreenWidth(window.innerWidth)
			}
			window.addEventListener("resize", handleResize);
			if(screenWidth<800){
				console.log("screen changed",screenWidth)
				document.getElementById("nav").classList.add("hide")
				document.getElementById("profile-settings").classList.add("hide")
				setClass("hide")
			}else{
				console.log("screen changed",screenWidth)
				document.getElementById("nav").classList.remove("hide")
				document.getElementById("profile-settings").classList.remove("hide")
			}
			return () => {
				window.removeEventListener("resize", handleResize);
			};
	},[])
	
	const onSearch = (searchTerm) => {
		setSelectedPost([])
		userProfileClick([])
		setUserPostsVisibility(0)
		api.post('/search',{
			user_id:student.user_id,
			key:searchTerm,
			noOfValues:5
		},{
			withCredentials: true
		}).then(response => {
			if(response.data.success===1){
				// setSearchData(response.data.data)
				var emptyArray = []
				console.log(response.data.data)
				emptyArray.push(response.data.data)
				userProfileClick(emptyArray)
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
		if(e.target.innerHTML==='Change password'){
			setFormType('passChange')
		}else if(e.target.innerHTML==='Edit Profile'){
			setFormType('editProfile')
		}else if(e.target.id==='notif-img'||e.target.id==='notifications'){
			setFormType('notifications')
		}
	}

	const mobileActionButtons=(e)=>{
		if(e.target.id==="menu-img"){
			const navbar = document.getElementById("nav")
			console.log(navbar.style.display)
			if(navbar.classList.contains("hide")){
				console.log("here check 2")
				document.body.classList.add('scrollable-container');
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
				})
			}
		}
    }

    return (
        <div id='main-body'>
			<div id="mobile-main-nav">
				<img  className='box-shadow' onClick={(e)=>mobileActionButtons(e)} src={process.env.PUBLIC_URL+'/menu.png'} id='menu-img' alt='menu-icon'/>
				<h1 id='branding-mobile'className='box-shadow' onClick={()=>{
					userProfileClick([])
					setSelectedPost([])
					setUserPostsVisibility(0)
				}}>Tribe.com</h1>
				<img  className='box-shadow' onClick={(e)=>mobileActionButtons(e)} src={process.env.PUBLIC_URL+'/settings.png'} id='settings-img' alt='settings-icon'/>
			</div>
			<div id='main-body-nav'>
				<form id='search-bar'>
					<input id='search-input' className='box-shadow' placeholder="Search for..." value={value} onChange={onChange} type="text"/>
					<div id='search-submit' className='box-shadow' type="submit" onClick={()=>onSearch(value)} >Search</div>
					<div id='search-dropdown'>
						{searchData.map((item)=>(
							<div className='search-result box-shadow'>{item.name+' ('+item.user_id+')'}</div>
						))}
					</div>
				</form>
				<div id='notifications'>
					<img  className='box-shadow' onClick={(e)=>handleChangeClick(e)} src={process.env.PUBLIC_URL+'/icons8-notifications-78.png'} id='notif-img'/>
				</div>
				<div id='profile-btn' onClick={()=>{
					handleSelfClick()
					setSelectedPost([])
				}} className='box-shadow'>{profileName}</div>
			</div>
			<div id='play-area'>
				<div id='action-center'>
					<div id='ac-head'>
						{(selectedPost.length>0)?(
							<div onClick={()=>backKey()} style={{display:"inline",marginRight:"2.5%"}}>
								<img alt='(interests)' onClick={()=>backKey()}  src={process.env.PUBLIC_URL+"/back-square-svgrepo-com.svg"}/>
							</div>
						):(
							<></>
						)}
						<h1 style={{ fontSize:'x-large'}}>{actionState.length==0?('posts'):('profile')}</h1>
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
							</>):(
								<>
									<Profile/>
									<PostParent user_id={actionState[0].user_id}/>
								</>
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
								{console.log(actionState)}
							</>
						)
						
						))):(
							<>
								<Profile/>
								<PostParent user_id={student.user_id}/>
							</>
					)
					)}
					
				</div>
				<div id='profile-settings' className={classToDisplay}>
					<div onClick={(e)=>handleChangeClick(e)} className='profile-changes-btn box-shadow'>Change password</div>
					<div onClick={(e)=>handleChangeClick(e)} className='profile-changes-btn box-shadow'>Edit Profile</div>
					<div onClick={logOut} id='logout-btn' className='box-shadow'>Logout</div>
				</div>
				{formType===''?(''):(<Form type={formType}/>)}
			</div>
		</div>
    )
}

export default MainBody