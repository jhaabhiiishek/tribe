import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getCookie from './getCookie';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const api = axios.create({
    baseURL: 'http://localhost:8080/',
});

function LeftContainer(e) {
    const [posts, setPosts] =useState([])
        var heading = e.heading;
        heading = "Posts"
        const student = getCookie()
        console.log(student)
        heading=student.user_id+" posts"

        const couldntFetch = (msg)=>{
            toast.success(msg.data.msg,{
                position:"bottom-center"
            });
        }

        api.post('/fetch_user_post',{
            user_id:student.user_id
        },{
            withCredentials: true
        }).then(response => {
            if(response.data.success===1){
                const newPosts = response.data.data[0].map((post,index)=>(
                    <div key={index} id='post'>
                        <h3>{response.data.data[0][index].text}</h3>
                    </div>
                ))
                setPosts(newPosts)
            }else{
                couldntFetch(response)
            }
        })

    return (
        <div id='leftContainer'>
            <h2 id = 'left-heading'>{heading}</h2>
			{posts}
            <ToastContainer/>
        </div>
    )
}

export default LeftContainer