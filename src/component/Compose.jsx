import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getCookie from './getCookie';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRef } from 'react';
import $ from 'jquery' 


const api = axios.create({
    baseURL: 'http://localhost:8080/',
});
function Compose() {
    const student = getCookie()
	const [text,setText] = useState('')
    const [compose,setCompose] = useState(false)
    const unBlurRef = useRef(null)
    
    const createPost = (e)=>{
        e.preventDefault()
		const formData = new FormData();
		formData.append({[e.target.name]:e.target.value})
		formData.append('file',e.target.files[0]);
        api.post('/createpost',{
			method:'POST',
			data: formData,
			config:{ headers: {'Content-Type':'multipart/form-data, boundary=${form._boundary}'}}
        }, {
            withCredentials: true,
        }).then(response => {
            notifySuccess(response)
        });
    }

    // useEffect(() => {
        // }, []);
        
        const createToggle = (e)=>{
            setCompose(true)
            document.body.classList.toggle('blur');
            var elem = $.get("#compose")
            // unBlurDiv.classList.toggle('.your-div-class ')
            // console.log(document.querySelector('#compose'))
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
	const uploadFile=(e)=>{

	}

    return (
        <div id='compose-parent'>
            {compose?(
                <div className='blur' id='compose'>
                    <form id='create-post'>
                        <h3 id='post-user_id'>{student.user_id}</h3>
                        <input type='text' id='post-input' required onChange={(e)=>setText(e.target.value)} value={text} placeholder='Add text...'></input>
                        <input id='media-input' type='file' required placeholder='Add text...'></input>
    
                        <button type='submit' onClick={(e)=>createPost(e)} id='submit-post'>Post</button>
                    </form>
                    <ToastContainer/>
                </div>
            ):(
                <a id='create-anchor' onClick={(e)=>createToggle(e)}>
                    <img id = 'create-post-image' src={process.env.PUBLIC_URL+"/compose.png"}></img>
                </a>
            )}
        </div>
    )
}

export default Compose