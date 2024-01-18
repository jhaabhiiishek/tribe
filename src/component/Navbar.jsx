import { useEffect, useState } from 'react';
import '../App.css';
import getCookie from './getCookie';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import Form from './Form';

const api = axios.create({
    baseURL: 'https://tribe-backend-sl5g.onrender.com/',
});

function Navbar() {
    const [friendsList, setFriends] = useState([])
    const [formType, setFormType] = useState('')
    const [tribesList, setTribeList] = useState([])

    const dispatch = useDispatch()
    const {userProfileClick,setConnectedUsers,setSelectedPost,setUserPostsVisibility} = bindActionCreators(actionCreators, dispatch)

    useEffect(()=>{
        fetchFriends()
        fetchTribes()
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

    const handleFriendsViewAll=()=>{
        setSelectedPost([])
        userProfileClick([])
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
            })
        }
    }
    const handleTribeViewAll=()=>{
        userProfileClick([])
        setSelectedPost([])
        setUserPostsVisibility(0)
        userProfileClick(tribesList)
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

    const handleFriendClick = (e)=>{
        userProfileClick([])
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
            })
        }
    }
    const handleTribeClick = async (e)=>{
        setSelectedPost([])
        userProfileClick([])
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

                userProfileClick(emptyArray)
            })
        }
    }
    
    return (
        <div id='nav'>
            <div id='nav-group'>
                <h1 id='branding'className='box-shadow' onClick={()=>{
                    userProfileClick([])
                    setSelectedPost([])
                    setUserPostsVisibility(0)
                }} >Tribe.in</h1>
                <h1 className='subgroup-heading'> friends </h1>
                <div className='vals-container'>
                    {(friendsList!==undefined)?(friendsList.slice(0,3).map((item)=>(
						<div className='vals box-shadow' onClick={()=>{handleFriendClick(item)}}>{item}</div>
					))):(
                        <div className='vals'>Add Friends Now!</div>
                    )}
                </div>
                <a className='view-all box-shadow' onClick={(e)=>{handleFriendsViewAll(e)}}>view all</a>
                <h1 className='subgroup-heading'> tribes</h1>
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