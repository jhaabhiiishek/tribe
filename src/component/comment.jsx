import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getCookie from './getCookie';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import { useSelector } from 'react-redux';

const api = axios.create({
    baseURL: 'http://localhost:8080/',
});
function Comment(e) {
    const value = e.value
    const student = getCookie()
    const [likes,setLikes]=useState(0)
    const [comment_value,setComment]= useState('')
    const [bgCol,setBgCol]= useState('')
    const [post_date,setPostDate]= useState('')
    const connects = useSelector(state=> state.connectedUser)
    const dispatch = useDispatch()
	const {userProfileClick,setUserPostsVisibility,setSelectedPost} = bindActionCreators(actionCreators, dispatch)
	useEffect(()=>{
        setLikes(value.upvotes)
        const current = new Date()
        const date = new Date(value.upload_date).toLocaleString('en-US', { month: 'short' });
        const day = new Date(value.upload_date).toLocaleString('en-US', { day: '2-digit' });
        const year = new Date(value.upload_date).toLocaleString('en-US', { year: 'numeric' });
        if(year!==current.getFullYear()){
            setPostDate(day+' '+date+', '+year)
        }else{
            setPostDate(day+' '+date)
        }
        setConnectedUsers()
    }, []);
    
    const postComment = (e,user_id,user_post_id,parent_comment_id)=>{
        e.preventDefault()
        api.post('/comment',{
            user_id:student.user_id,
            post_by_user_id:user_id,
            user_post_id:user_post_id,
            parent_comment_id:parent_comment_id,
            text: comment_value
        }, {
            withCredentials: true,
        }).then(response => {
            notifySuccess(response)
        });
        setComment('')
		setTimeout(window.location.reload,2400)
    }
    const setConnectedUsers = ()=>{
        if(value&&value.user_id&&connects.includes(value.user_id,0)){

        }
    }
    const notifySuccess = (msg)=>{
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

    
    const handleFriendClick = (e)=>{
        userProfileClick([])
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

    const likePost = async (e)=>{
        console.log(e.target.parentNode.style.backgroundColor)
        if(e.target.parentNode.style.backgroundColor=='#e56363'||e.target.parentNode.style.backgroundColor=='rgb(229, 99, 99)'){
            e.target.parentNode.style.backgroundColor='#bdb9b9'
        }else{
            console.log("bdb9b9")
            e.target.parentNode.style.backgroundColor='#e56363'
        }
        await api.post('/upvote',{
            user_id:student.user_id,
            posted_by:value.user_id,
            user_post_id:value.user_post_id
        }, {
            withCredentials: true,
        }).then(response => {
            setLikes(response.data.likes)
        });
    }
    const displaySelectedPost = async (data)=>{
        var postArray = []
        postArray.push(data)
        setSelectedPost([])
        await api.post('/fetchpostcomment',{
            user_id:student.user_id,
            post_by_user_id:value.user_id,
            user_post_id:value.user_post_id,
            entries_required:50
        }, {
            withCredentials: true,
        }).then(async(response) => {
            var comments = response.data.data
            for(var v=0;v<comments.length;v++){
                postArray.push(comments[v])
            }
            setSelectedPost(postArray)
        })
    }

    
    return (
			<div id='comment'>
				<div id='post' style={{wordWrap: 'break-word',paddingBottom:'1%'}}>
					<div id='post-user_id'>
						<h3 onClick={()=>{handleFriendClick(value.made_by_user_id)}} style={{fontWeight: "500",width:'max-content',padding: "1%"}}>{value.made_by_user_id}</h3>
						{(value.made_by_user_id!==student.user_id)?(
							<div id='link-div' onClick={{}} style={{backgroundColor:'rgb(120, 169, 233)',border:"0.5px solid black"}}>
								<img src={process.env.PUBLIC_URL+"/link-minimalistic-svgrepo-com.svg"} style={{display:'inline'}}></img>
								<h4 id='post-upvotes' style={{display:"inline",fontWeight:"300",paddingLeft:'3.5%',paddingRight:'3.5%'}}> connect </h4>
							</div>
						):(<></>)}
					</div>
					<h3 id='post-text'>{value.text}</h3>
					{/* <div id='like-div'  onClick={(e)=>likePost(e)} style={{backgroundColor:bgCol}}>
							<img id="like-image" src={process.env.PUBLIC_URL+"/notifications.png"}>
							</img>
						<h4 id='post-upvotes'> {value.upvotes} likes</h4>
					</div> */}
					<div id='like-div'>
						<h4 id='post-upvotes'><span style={{color:'green'}}>● </span>{Math.round(((new Date())-(new Date(value.upload_date)))/(60000*60*24))} days ago</h4>
					</div>
					{/* <h3 id='post-comment_id'>{data.comment_id}</h3> */}
					<form id='comment'>
						<input id='comment-prompt' type='text' required onChange={(e)=>setComment(e.target.value)} value={comment_value} placeholder='comment...'></input>
						<button type='submit' onClick={(e)=>postComment(e,value.user_id,value.user_post_id,value._id)}id='comment-post' style={{marginBottom:'0px',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
							<div style={{marginLeft:"15%"}}>Post</div>
							<img src={process.env.PUBLIC_URL+"/send-svgrepo-com.svg"}></img>
						</button>
					</form>
					<ToastContainer/>
				</div>
			</div>
    )
}

export default Comment