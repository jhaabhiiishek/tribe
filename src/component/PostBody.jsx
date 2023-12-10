import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getCookie from './getCookie';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const api = axios.create({
    baseURL: 'http://localhost:8080/',
});
function PostBody(e) {
    useEffect(()=>{
        setLikes(data.upvotes)
    }, []);
	const index= e.keyValue
    const data = e.data
    const student = getCookie()
    const [likes,setLikes]=useState(0)
    const [comment_value,setComment]= useState('')
    
    const postComment = (e,user_id,user_post_id)=>{
        e.preventDefault()
        api.post('/comment',{
            user_id:student.user_id,
            post_by_user_id:user_id,
            user_post_id:user_post_id,
            parent_comment_id:'',
            text: comment_value
        }, {
            withCredentials: true,
        }).then(response => {
            console.log(response)
            notifySuccess(response)
        });
        setComment('')
    }

    const notifySuccess = (msg)=>{
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

    const likePost = (user_id,user_post_id)=>{
        api.post('/upvote',{
            user_id:student.user_id,
            posted_by:user_id,
            user_post_id:user_post_id
        }, {
            withCredentials: true,
        }).then(response => {
            console.log(response)
            setLikes(response.data.likes)
        });
    }
    return (
        <div key={index} id='post'>
            <h3 id='post-user_id'>{data.user_id}</h3>
            <h3 id='post-text'>{data.text}</h3>
            <a id="like-anchor" onClick={()=>likePost(data.user_id,data.user_post_id)}>
                <img id="like-image" src={process.env.PUBLIC_URL+"/notifications.png"}>
                </img>
            </a>
            <h4 id='post-upvotes'>{likes} likes</h4>
            <h3 id='post-comment_id'>{data.comment_id}</h3>
            <form id='comment'>
                <input id='comment-prompt' type='text' required onChange={(e)=>setComment(e.target.value)} value={comment_value} placeholder='comment...'></input>
                <button type='submit' onClick={(e)=>postComment(e,data.user_id,data.user_post_id)}id='comment-post' style={{marginBottom:'0px'}}>Post</button>
            </form>
            <button className='no-decoration'>View Comments</button>
            <ToastContainer/>
        </div>
    )
}

export default PostBody