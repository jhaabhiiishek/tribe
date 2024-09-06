import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getCookie from './getCookie';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostBody from './PostBody'

import api from './api';

function LeftContainer(e) {
        useEffect(()=>{
            fetchPosts()
        }, []);

        const [posts, setPosts] =useState([])
        var heading = e.heading;
        heading = "Posts"
        const student = getCookie()
        heading=student.user_id+" posts"

        const fetchPosts=()=>{
            api.post('/fetch_user_post',{
                user_id:student.user_id
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
        
        const couldntFetch = (msg)=>{
            toast.success(msg.data.msg,{
                position:"bottom-center"
            });
        }
        

    // The poster profile will be shown when the user clicks on user_id
    // The get_upvotedBy route will be hit when user clicks on number of likes 

    return (
        <div id='leftContainer'>
            <h2 id = 'left-heading'>{heading}</h2>
			{posts}
            <ToastContainer/>
        </div>
    )
}

export default LeftContainer