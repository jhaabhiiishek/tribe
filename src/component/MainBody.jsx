import { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import getCookie from './getCookie';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostBody from './PostBody'


const api = axios.create({
    baseURL: 'http://localhost:8080/',
});


function MainBody(e) {
	const [nullCookie, setNullCookie] = useState(true);
	const [profileName, setProfileName] = useState('');
	const [posts, setPosts] =useState([])

    var heading = e.heading;
    heading = "Posts"
    const student = getCookie()
    console.log(student)
    heading=student.user_id+" posts"

	const fetchPosts=()=>{
		api.post('/fetch_user_post',{
			user_id:student.user_id
		},{
			withCredentials: true
		}).then(response => {
			console.log(response)
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

	const couldntFetch = (msg)=>{
		toast.success(msg.data.msg,{
			position:"bottom-center"
		});
	}

	useEffect(()=>{
			const studentCookie= getCookie();
			console.log(studentCookie)
			if(studentCookie!==undefined){
			  console.log("Previous exists")
			  setProfileName(studentCookie.user_id)
			  setNullCookie(false)
			}
			fetchPosts()
		  }, [])
    return (
        <div id='main-body'>
			<div id='main-body-nav'>
				<form id='search-bar'>
					<input id='search-input' type="text"/>
					<div id='search-submit' type="submit" >Search</div>
				</form>
				<div id='notifications'>
					<img src={process.env.PUBLIC_URL+'/icons8-notifications-78.png'} id='notif-img'/>
				</div>
				<div id='profile-btn'>{profileName}</div>
			</div>
			<div id='play-area'>
				<div id='action-center'>
					<h1 className='subgroup-heading' style={{marginTop: "2.5%"}}>posts</h1>
					{posts}
				</div>
				<div id='profile-settings'>
					<div className='profile-changes-btn'>Change password</div>
					<div className='profile-changes-btn'>Edit Profile</div>
					<div id='logout-btn'>Logout</div>
				</div>
			</div>
		</div>
    )
}

export default MainBody