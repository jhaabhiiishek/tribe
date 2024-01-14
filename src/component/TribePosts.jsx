import { useEffect,useState } from 'react';
import PostBody from './PostBody'
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import getCookie from './getCookie';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import { useSelector } from 'react-redux';

const api = axios.create({
    baseURL: 'https://tribe.azurewebsites.net',
});


function TribePosts() {
	const actionState = useSelector(state => state.actionArea)
	const dispatch = useDispatch()
	const {userProfileClick,tribeClick,setUserPostsVisibility} = bindActionCreators(actionCreators, dispatch)
	const [postArray,setPostsArray] = useState([])

	const couldntFetch = (msg)=>{
		toast.success(msg.data.msg,{
			position:"bottom-center"
		});
	}
	useEffect(()=>{
		if(actionState[0].tribe_id!==undefined){
			setPostsArray(actionState[1])
		}
	})

	
    return (
		<>
		{(postArray!==null && postArray!==undefined)&& postArray.map((post,index)=>{
			return(
				<div>
					<PostBody keyValue={index} data={post}/>
				</div>
			)
		})}
		</>
    )
}

export default TribePosts