import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getCookie from './getCookie';


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

    const likePost = (user_id,user_post_id)=>{
        console.log("here",user_id,user_post_id)
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
            <h3 id='post-media_link'>{data.media_link}</h3>
            <h3 id='post-text'>{data.text}</h3>
            <a id="like-anchor" onClick={()=>likePost(data.user_id,data.user_post_id)}>
                <img id="like-image" src={process.env.PUBLIC_URL+"/notifications.png"}>
                </img>
            </a>
            <h4 id='post-upvotes'>{likes} likes</h4>
            <h3 id='post-comment_id'>{data.comment_id}</h3>
            <form id='comment'>
            <input id='comment-prompt' placeholder='comment...'></input>
            <button id='comment-post'>Post</button>
            </form>
        </div>
    )
}

export default PostBody