import { useEffect, useState } from 'react';
import '../App.css';
import getCookie from './getCookie';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import Form from './Form';

import api from './api';
function Navbar() {
    const [friendsList, setFriends] = useState([])
    const [formType, setFormType] = useState('')
    const [tribesList, setTribeList] = useState([])
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [classToDisplay,setClass] = useState('')

    const dispatch = useDispatch()
    const {userProfileClick,setConnectedUsers,setLoadingAnimation,setSelectedPost,setUserPostsVisibility} = bindActionCreators(actionCreators, dispatch)

    useEffect(()=>{
        fetchFriends()
        fetchTribes()
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


    const handleChangeClick = (e)=>{
		document.body.classList.add('scrollable-container');
		if(document.getElementById('abruptPostForms')){
			document.getElementById('abruptPostForms').style.display='block'
		}
		if(e.target.innerHTML==='Create Post'){
			setFormType('createPost')
		}else if(e.target.innerHTML==='Create Tribe'){
			setFormType('createTribe')
		}
	}

    const fetchFriends= ()=>{
        const studentCookie= getCookie();
        if(studentCookie!==undefined){
            api.post('/fetch_links',{
                user_id:studentCookie.user_id,
                key:studentCookie.user_id
            },{
                withCredentials: true
            }).then(response => {
                if(response.data.data!==undefined){
                    setFriends(response.data.data.links)
                    setConnectedUsers(response.data.data.links)
                }
            })
        }
    }

    const fetchTribes=()=>{
        const studentCookie= getCookie();
        if(studentCookie!==undefined){
            api.post('/fetch_tribes',{
                user_id:studentCookie.user_id
            },{
                withCredentials: true
            }).then(response => {
                    setTribeList(response.data.data)
            })
        }
    }


    const handleFriendsViewAll=()=>{
        setSelectedPost([])
        userProfileClick([])
        setLoadingAnimation(1)
        setUserPostsVisibility(0)
        const studentCookie= getCookie();
        if(studentCookie!==undefined){
            api.post('/fetch_all_links_of',{
                user_id:studentCookie.user_id,
                key:studentCookie.user_id
            },{
                withCredentials: true
            }).then(response => {
                var emptyArray = []
                console.log(response.data.data)
                emptyArray.push(response.data.data)
                userProfileClick(emptyArray)
                setLoadingAnimation(0)
            })
        }
    }
    const handleTribeViewAll=()=>{
        userProfileClick([])
        setSelectedPost([])
        setLoadingAnimation(1)
        setUserPostsVisibility(0)
        userProfileClick(tribesList)
        setLoadingAnimation(0)
    }


    const handleFriendClick = (e)=>{
        userProfileClick([])
        setLoadingAnimation(1)
        setSelectedPost([])
        console.log(e)
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
    const handleTribeClick = async (e)=>{
        setSelectedPost([])
        userProfileClick([])
        setLoadingAnimation(1)
        setUserPostsVisibility(0)
        const studentCookie= getCookie();
        if(studentCookie!==undefined){
            var emptyArray = []
            await api.post('/search_tribe',{
                user_id:studentCookie.user_id,
                tribe_id:e.tribe_id
            },{
                withCredentials: true
            }).then(async (response) =>  {
                emptyArray.push(response.data.data)

                await api.post('/fetch_tribe_post',{
                    user_id:studentCookie.user_id,
                    tribe_id:e.tribe_id
                },{
                    withCredentials: true
                }).then((res) => {
                    emptyArray.push(res.data.data)
                })
                setLoadingAnimation(0)
                userProfileClick(emptyArray)
            })
        }
    }
    const mobileActionButtons=(e)=>{
		if(e.target.id==="close-img"){
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
    
    return (
        <div id='nav' className={classToDisplay}>
            <div id='nav-group'>
                <img onClick={(e)=>mobileActionButtons(e)} src={process.env.PUBLIC_URL+'/closenav.png'} id='close-img'/>
                <h1 id='branding'className='box-shadow' onClick={()=>{
                    userProfileClick([])
                    setSelectedPost([])
                    setUserPostsVisibility(0)
                }} >TribeIn</h1>
                <h1 className='subgroup-heading'> Friends </h1>
                <div className='vals-container'>
                    {(friendsList!==undefined)?(friendsList.slice(0,3).map((item)=>(
						<div className='vals box-shadow' onClick={()=>{handleFriendClick(item)}}>{item}</div>
					))):(
                        <div className='vals'>Add Friends Now!</div>
                    )}
                </div>
                <a className='view-all box-shadow' onClick={(e)=>{handleFriendsViewAll(e)}}>view all</a>
                <h1 className='subgroup-heading'> Tribes</h1>
                <div className='vals-container'>
                    {(tribesList&&tribesList.length>0)?(tribesList.slice(0,3).map((item)=>( 
						<div className='vals box-shadow' onClick={()=>{handleTribeClick(item)}}>{item.name}</div>
					))):(
                        <div className='vals '>Join Tribes Now!</div>
                    )}
                </div>
                <a className='view-all box-shadow' onClick={(e)=>{handleTribeViewAll(e)}} >view all</a>
            </div>
            <div>
                <div onClick={(e)=>handleChangeClick(e)} className='compose box-shadow'>Create Post</div>
                {formType===''?(''):(<Form type={formType}/>)}
                <div onClick={(e)=>handleChangeClick(e)} className='compose box-shadow'>Create Tribe</div>
            </div>
        </div>
    )
}

export default Navbar