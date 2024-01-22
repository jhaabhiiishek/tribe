import '../App.css';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import getCookie from './getCookie';

import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Form from './Form';

const api = axios.create({
    baseURL: 'https://tribe-backend-sl5g.onrender.com/',
});
function Profile(e) {
    const actionState = useSelector(state => state.actionArea)
	const connects = useSelector(state=> state.connectedUser)
    const sentRequests = useSelector(state=>state.sentRequests)
	
    const dispatch = useDispatch()
    const {userProfileClick,setUserPostsVisibility,setSentRequests,setLoadingAnimation,setConnectedUsers} = bindActionCreators(actionCreators, dispatch)

	const [commonMems,setCommonMems]=useState([])
    const [formType, setFormType] = useState('')	
    const [conBgCol,setConBgCol]= useState('')
	useEffect(()=>{
		if(actionState[0].members!==undefined){
			var selfLessArray = returnWithoutSelf(actionState[0].members);
			setCommonMems(selfLessArray)
		}
	})

	const student = getCookie()

	
    const handleFriendClick = (e)=>{
        userProfileClick([])
		setLoadingAnimation(1)
        setUserPostsVisibility(0)
        const studentCookie= getCookie();
        if(studentCookie!==undefined){
            api.post('/fetch_links',{
                user_id:studentCookie.user_id,
                key:e
            },{
                withCredentials: true
            }).then((response) => {
                var emptyArray = []
                emptyArray.push(response.data.data)
                userProfileClick(emptyArray)
				setLoadingAnimation(0)
            })
        }
    }
	const leaveTribe = async(e)=>{
		e.preventDefault()
		console.log(e)
		await api.post('/leave_tribe',{
			user_id:studentCookie.user_id,
			tribe_id:actionState[0].tribe_id
		},{
			withCredentials: true
		}).then((response) => {
			console.log(response)
			if(response.data.success===1){
				toast.success(response.data.msg,{position:"bottom-center"})
			}else{
				toast.error(response.data.msg,{position:"bottom-center"})
			}
		})
		setTimeout(()=>{window.location.reload()},2500)
	}

	const handleChangeClick = (e)=>{
		document.body.classList.add('scrollable-container');
		if(document.getElementById('abruptPostForms')){
			document.getElementById('abruptPostForms').style.display='block'
		}
		if(e.target.innerHTML==='Create Post'){
			setFormType('createPost')
		}else if(e.target.innerHTML==='Create Tribe'){
			setFormType('createTribe')
		}else if(e.target.innerHTML==='Post Tribe'){
			setFormType('tribePost')
		}else if(e.target.innerHTML==='Invite Members'){
			setFormType('inviteMembers')
		}
	}
	const studentCookie = getCookie();
	const openEmailPrompt=(e)=>{
		window.location ='mailto:'+e.target.innerHTML
	}
	
	function returnWithoutSelf(e){
		e.filter((item)=>{
			return item!==studentCookie.user_id
		})
		return e
	}
	const connectClick = async(data)=>{
        if(connects.includes(data.user_id,0)){
            console.log('true tha')
            await api.post('/removelink',{
                user_id:student.user_id,
                other_uid:data.user_id
            }, {
                withCredentials: true,
            }).then(response => {
                if(response.data.success===1){
                    var arr = sentRequests
                    var value=data.user_id
                    arr = arr.filter(item => item!==value)
                    setSentRequests(arr)
                    var arr2 = connects
                    arr2 = arr2.filter(item => item!==value)
                    setConnectedUsers(arr2)
                    toast.success(response.data.msg,{position:"bottom-center"})
                    setConBgCol('rgb(225,225,225)')
                }else{
                    toast.error(response.data.msg,{position:"bottom-center"})
                    setConBgCol('rgb(120, 169, 233)')
                }
            });
        }else{
            console.log('true nahi tha')
            await api.post('/sendlinkrequest',{
                user_id:student.user_id,
                receiver_user_id:data.user_id
            }, {
                withCredentials: true,
            }).then(response => {
                if(response.data.success===1){
                    var arr = sentRequests
                    arr.push(data.user_id)
                    setSentRequests(arr)
                    toast.success(response.data.msg,{position:"bottom-center"})
                    setConBgCol('rgb(225,225,225)')
                }else{
                    toast.error(response.data.msg,{position:"bottom-center"})
                    setConBgCol('rgb(120, 169, 233)')
                }
            });

        }
        // if(conBgCol==='rgb(120, 169, 233)'){
        //     setConBgCol('rgb(225,225,225)')
        // }else if(conBgCol==='rgb(225,225,225)'){
        //     setConBgCol('rgb(120, 169, 233)')
        // }
    }
    return (
        <div id='profile'>
			{formType===''?(''):(<Form type={formType}/>)}
            {(actionState.length>0 &&(actionState[0]!==undefined)&& (actionState[0].tribe_id==undefined || actionState[0].tribe_id==undefined))?((actionState.map((item)=>(
				
				// Person's profile design layout
				<div id='profile-main-div' className='search-result box-shadow'>
					<div id="profile-main-left">
						<div style={{fontSize: 'x-large'}}>{item.name}</div>
						<div style={{color:'blue'}}>@{item.user_id}</div>
						<div >{item.job}</div>
						<div onClick={(e)=>openEmailPrompt(e)}>{item.email}</div>
						<div style={{marginBottom:'4%',marginTop:'2%',paddingLeft:'0%'}}>
							<div className='profile-tags box-shadow' style={{display:'inline'}}>
								<img className='icon-imgs' alt='(course)' src={process.env.PUBLIC_URL+"/thesis.png"}></img>
								{item.course}
							</div>
							<div className='profile-tags box-shadow' style={{display:'inline'}}>
								<img className='icon-imgs' alt='(college)' src={process.env.PUBLIC_URL+"/academy.png"}></img>
								{item.college}
							</div>
						</div>
						<div className='profile-tags box-shadow' style={{display:'inline'}}>
							<img className='icon-imgs' alt='(city)' src={process.env.PUBLIC_URL+"/worldwide.png"}></img>
							{item.home_city}
						</div>
						<div id="tags-container">
						{(item.interests)&&(item.interests.map((interest)=>{
							return(
								<div className='profile-tags box-shadow' style={{display:'inline',backgroundColor:'rgb(0, 0, 0)',color: 'white'}}>
									{/* <img className='icon-imgs' alt='(interests)' src={process.env.PUBLIC_URL+"/hashtag.png"}/> */}
									#{interest}
								</div>
							)
						}))}
						</div>
						<div style={{display:'block',marginTop:'4%'}}>
						</div>
						<div style={{display:'inline',marginTop:'4%'}}>
							followed by
						</div>
						{(item.links)&& item.links.slice(0,2).map((link)=>{
							if(link!==studentCookie.user_id){
								return(
									<div className='profile-tags box-shadow' onClick={()=>{handleFriendClick(link)}} style={{marginBottom:'2%',marginTop:'3%',display:'inline'}}>
										<img className='icon-imgs' src={process.env.PUBLIC_URL+"/circle.png"}></img>
										@{link}
									</div>
								)
							}else{
								return(
									<>no one that you know</>
									)
								}
							})}
					</div>
					<div id="profile-main-right">
						{(item.user_id!==student.user_id)?(
							<div id='link-div' onClick={()=>connectClick(item)} style={{backgroundColor:conBgCol,border:"0.5px solid black"}}>
								<img src={process.env.PUBLIC_URL+"/link-minimalistic-svgrepo-com.svg"} style={{display:'inline'}}></img>
								<h4 id='post-upvotes' style={{display:"inline",fontWeight:"300",paddingLeft:'3.5%',paddingRight:'3.5%'}}> {!sentRequests.includes(item.user_id,0)?('sent'):(connects.includes(item.user_id,0)?('connected'):('connect'))}</h4>
							</div>
						):(<></>)}
					</div>
				</div>
			)))):(
				// Tribe profile design layout
				<div id='profile-main-div' className='search-result box-shadow'>
					<div id="profile-main-left">
						<div style={{fontSize: 'x-large'}}>{actionState[0].name}</div>
						<div style={{marginBottom:'2.5%'}}>made by {actionState[0].creator}</div>
							<div className='profile-tags box-shadow' style={{display:'inline'}}>
								{actionState[0].tribe_type}
							</div>
						<div id="tags-container">
							{(actionState[0].tags)&&(actionState[0].tags.map((interest)=>{
								return(
									<div className='profile-tags box-shadow' style={{display:'inline',backgroundColor:'rgb(0, 0, 0)',color: 'white'}}>
									{/* <img className='icon-imgs' alt='(interests)' src={process.env.PUBLIC_URL+"/hashtag.png"}/> */}
									#{interest}
									</div>
									)
								}))}
						</div>
						{/* <div className='profile-tags box-shadow' style={{display:'inline'}}>
							{console.log(actionState[0].tribe_location)}
							<img className='icon-imgs' alt='(city)' src={process.env.PUBLIC_URL+"/worldwide.png"}></img>
							{(actionState[0].tribe_location=='undefined')?(actionState[0].tribe_location):(<>Online</>)}
						</div> */}
						{commonMems.length>1 && (
							<div style={{display:'inline'}}>
								other members:
							</div>
						)}
						{commonMems.slice(0,2).map((member)=>{
							<div className='profile-tags box-shadow' onClick={()=>{handleFriendClick(member)}} style={{marginBottom:'2%',marginTop:'3%',display:'inline'}}>
								<img className='icon-imgs' src={process.env.PUBLIC_URL+"/circle.png"}></img>
								@{member}
							</div>
						})}
						{commonMems.length>1 && (
							<div style={{display:'inline'}}>
								and {commonMems.length-1} others
							</div>
						)}
					</div>
					<div id="profile-main-right">
						<div onClick={(e)=>handleChangeClick(e)} className='compose box-shadow'  style={{textAlign:'center',width:'75%'}}>Post Tribe</div>
						<div onClick={(e)=>handleChangeClick(e)} className='compose box-shadow'  style={{textAlign:'center',width:'75%',backgroundColor:'rgb(120,169,233)'}}>Invite Members</div>
						<div onClick={(e)=>leaveTribe(e)} className='compose box-shadow'  style={{textAlign:'center',width:'75%',backgroundColor:'rgb(247, 80, 69)'}}>Leave Tribe</div>
					</div>
				</div>
			)}
        </div>
    )
}

export default Profile