import { useEffect,useState } from 'react';
import PostBody from './PostBody'
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import getCookie from './getCookie';


import api from './api';

function PostParent(e) {
	const [posts, setPosts] =useState([])
	const student = getCookie()
	const fetchPosts=(user_id_for_search)=>{
		api.post('/fetch_post_by_user',{
			user_id:student.user_id,
			accToBeSearched:user_id_for_search
		},{
			withCredentials: true
		}).then(response => {
			if(response.data.success===1){
				const newPosts = response.data.data.map((post,index)=>(
					<PostBody keyValue={index} data={post}/>
				))
				setPosts(newPosts)
			}else{
				couldntFetch(response)
			}
		})
	}
	
	useEffect(()=>{
		fetchPosts(e.user_id)
	},[]	)


	const couldntFetch = (msg)=>{
		toast.success(msg.data.msg,{
			position:"bottom-center"
		});
	}

	
    return (
		<>
		{posts.map((post)=>{
			return(
				<div>
					{post}
				</div>
			)
		})}
		</>
    )
}

export default PostParent