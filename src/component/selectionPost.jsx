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

import Comment from './comment';

import api from './api';
function SelectionPost(e) {
    const dispatch = useDispatch()
	const {userProfileClick,setUserPostsVisibility,setSentRequests,setLoadingAnimation,setSelectedPost} = bindActionCreators(actionCreators, dispatch)
	const selectedPost = useSelector(state=>state.selectedPost)
    const connects = useSelector(state=> state.connectedUser)
	const likedPosts = useSelector(state=> state.likedPosts)
    const sentRequests = useSelector(state=>state.sentRequests)

    const data = e.data
    const student = getCookie()
    const [likes,setLikes]=useState(0)
    const [comment_value,setComment]= useState('')
    const [bgCol,setBgCol]= useState('')
    const [post_date,setPostDate]= useState('')
    const [conBgCol,setConBgCol]= useState('')

	useEffect(()=>{
        setLikes(selectedPost[0].upvotes)
        const current = new Date()
        const date = new Date(selectedPost[0].upload_date).toLocaleString('en-US', { month: 'short' });
        const day = new Date(selectedPost[0].upload_date).toLocaleString('en-US', { day: '2-digit' });
        const year = new Date(selectedPost[0].upload_date).toLocaleString('en-US', { year: 'numeric' });
        if(year!==current.getFullYear()){
            setPostDate(day+' '+date+', '+year)
        }else{
            setPostDate(day+' '+date)
        }
        setConnectedUsers()
        setColor()
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

    const setColor = ()=>{
        var newObj = {
            post_user_id:selectedPost[0].user_id,
            post_user_post_id:selectedPost[0].user_post_id
        }
        var check = false;

        // Could've just set the _id check for the post rather than the combination

        for(var v=0;v<likedPosts.length;v++){
            const string1= JSON.stringify(likedPosts[v])
            const string2= JSON.stringify(newObj)
            check = (string1===string2)
            if(check)break
        }
        if(check){
            console.log('idhr')
            var colString = 'rgb(229, 99, 99)'
            setBgCol(colString)
        }else{
            console.log('nhi toh idhr')
            setBgCol('#bdb9b9')
        }
    }
    const setConnectedUsers = ()=>{
        if(selectedPost[0]&&selectedPost[0].user_id&&connects.includes(selectedPost[0].user_id,0)){

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
        setLoadingAnimation(1)
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
                setLoadingAnimation(0)
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
            posted_by:selectedPost[0].user_id,
            user_post_id:selectedPost[0].user_post_id
        }, {
            withCredentials: true,
        }).then(response => {
            setLikes(response.data.likes)
        });
    }
    const connectClick = async()=>{
        if(connects.includes(selectedPost[0].user_id,0)){
            console.log('true tha')
            await api.post('/removelink',{
                user_id:student.user_id,
                other_uid:selectedPost[0].user_id
            }, {
                withCredentials: true,
            }).then(response => {
                if(response.data.success===1){
                    var arr = sentRequests
                    var value=selectedPost[0].user_id
                    arr = arr.filter(item => item!==value)
                    setSentRequests(arr)
                    var arr2 = connects
                    arr2 = arr2.filter(item => item!==value)
                    setConnectedUsers(arr2)
                    toast.success(response.data.msg,{position:"bottom-center"})
                    setConBgCol('rgb(225,225,225)')
                }else{
                    toast.error(response.data.msg,{position:"bottom-center"})
                    setConBgCol('rgb(120, 169, 233)')
                }
            });
        }else{
            console.log('true nahi tha')
            await api.post('/sendlinkrequest',{
                user_id:student.user_id,
                receiver_user_id:data.user_id
            }, {
                withCredentials: true,
            }).then(response => {
                if(response.data.success===1){
                    var arr = sentRequests
                    arr.push(data.user_id)
                    setSentRequests(arr)
                    toast.success(response.data.msg,{position:"bottom-center"})
                    setConBgCol('rgb(225,225,225)')
                }else{
                    toast.error(response.data.msg,{position:"bottom-center"})
                    setConBgCol('rgb(120, 169, 233)')
                }
            });

        }
        // if(conBgCol==='rgb(120, 169, 233)'){
        //     setConBgCol('rgb(225,225,225)')
        // }else if(conBgCol==='rgb(225,225,225)'){
        //     setConBgCol('rgb(120, 169, 233)')
        // }
    }
    const displaySelectedPost = async (data)=>{
        var postArray = []
        postArray.push(data)
        setSelectedPost([])
        await api.post('/fetchpostcomment',{
            user_id:student.user_id,
            post_by_user_id:selectedPost[0].user_id,
            user_post_id:selectedPost[0].user_post_id,
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
        <div style={{wordWrap: 'break-word',paddingBottom:'1%'}}>
            <div id='post' style={{wordWrap: 'break-word',paddingBottom:'1%'}}>
				<div id='post-user_id'>
					<h3 onClick={()=>{setSelectedPost([]);handleFriendClick(selectedPost[0].user_id)}} style={{fontWeight: "500",width:'max-content',padding: "1%"}}>{selectedPost[0].user_id}</h3>
					{(selectedPost[0].user_id!==student.user_id)?(
						<div id='link-div' onClick={()=>connectClick()} style={{backgroundColor:conBgCol,border:"0.5px solid black"}}>
							<img src={process.env.PUBLIC_URL+"/link-minimalistic-svgrepo-com.svg"} style={{display:'inline'}}></img>
							<h4 id='post-upvotes' style={{display:"inline",fontWeight:"300",paddingLeft:'3.5%',paddingRight:'3.5%'}}> {!sentRequests.includes(selectedPost[0].user_id,0)?("sent"):(connects.includes(selectedPost[0].user_id,0)?('connected'):('connect'))}
                         </h4>
						</div>
					):(<></>)}
				</div>
				<h3 id='post-text' onClick={()=>displaySelectedPost(selectedPost[0])}>{selectedPost[0].text}</h3>
				<div id='like-div'  onClick={(e)=>likePost(e)} style={{backgroundColor:bgCol}}>
					{/*<a id="like-anchor" > */}
						<img id="like-image" src={process.env.PUBLIC_URL+"/notifications.png"}>
						</img>
					{/* </a> */}
					<h4 id='post-upvotes'> {likes} likes</h4>
				</div>
				<div id='like-div'>
					<h4 id='post-upvotes'><span style={{color:'green'}}>● </span>{post_date}</h4>
				</div>
				{/* <h3 id='post-comment_id'>{data.comment_id}</h3> */}
				<form id='comment'>
					<input id='comment-prompt' type='text' required onChange={(e)=>setComment(e.target.value)} value={comment_value} placeholder='comment...'></input>
					<button type='submit' onClick={(e)=>postComment(e,selectedPost[0].user_id,selectedPost[0].user_post_id,'')}id='comment-post' style={{marginBottom:'0px',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
						<div style={{marginLeft:"15%"}}>Post</div>
						<img src={process.env.PUBLIC_URL+"/send-svgrepo-com.svg"}></img>
					</button>
				</form>
				<ToastContainer/>
			</div>
            <div id='comment-container'>
                <div className='empty-line-div'></div>
                <div id="comment-subdiv">
                    {selectedPost && (selectedPost[1]===undefined||selectedPost[1]===null)?(
                        <div className='search-result box-shadow'>No comments yet</div>
                    ):(selectedPost&&(selectedPost.map((value, index) => {
                        if(index>0){
                            return(
                                // <div id='comment'>
                                // 	<div id='post' style={{wordWrap: 'break-word',paddingBottom:'1%'}}>
                                // 	<div id='post-user_id'>
                                // 		<h3 onClick={()=>{handleFriendClick(value.made_by_user_id)}} style={{fontWeight: "500",width:'max-content',padding: "1%"}}>{value.made_by_user_id}</h3>
                                // 		{(value.made_by_user_id!==student.user_id)?(
                                // 			<div id='link-div' onClick={{}} style={{backgroundColor:'rgb(120, 169, 233)',border:"0.5px solid black"}}>
                                // 				<img src={process.env.PUBLIC_URL+"/link-minimalistic-svgrepo-com.svg"} style={{display:'inline'}}></img>
                                // 				<h4 id='post-upvotes' style={{display:"inline",fontWeight:"300",paddingLeft:'3.5%',paddingRight:'3.5%'}}> connect </h4>
                                // 			</div>
                                // 		):(<></>)}
                                // 	</div>
                                // 	<h3 id='post-text'>{value.text}</h3>
                                // 	<div id='like-div'  onClick={(e)=>likePost(e)} style={{backgroundColor:bgCol}}>
                                // 		{/*<a id="like-anchor" > */}
                                // 			<img id="like-image" src={process.env.PUBLIC_URL+"/notifications.png"}>
                                // 			</img>
                                // 		{/* </a> */}
                                // 		<h4 id='post-upvotes'> {value.upvotes} likes</h4>
                                // 	</div>
                                // 	<div id='like-div'>
                                // 		<h4 id='post-upvotes'><span style={{color:'green'}}>● </span>{Math.round(((new Date())-(new Date(value.upload_date)))/(60000*60*24))} days ago</h4>
                                // 	</div>
                                // 	{/* <h3 id='post-comment_id'>{data.comment_id}</h3> */}
                                // 	<form id='comment'>
                                // 		<input id='comment-prompt' type='text' required onChange={(e)=>setComment(e.target.value)} value={comment_value} placeholder='comment...'></input>
                                // 		<button type='submit' onClick={(e)=>postComment(e,selectedPost[0].user_id,selectedPost[0].user_post_id,value._id)}id='comment-post' style={{marginBottom:'0px',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
                                // 			<div style={{marginLeft:"15%"}}>Post</div>
                                // 			<img src={process.env.PUBLIC_URL+"/send-svgrepo-com.svg"}></img>
                                // 		</button>
                                // 	</form>
                                // 	<ToastContainer/>
                                // </div>
                                // </div>
                                <Comment value={value}/>
                            );
                        }
                    })))}
                </div>
            </div>
        </div>
    )
}

export default SelectionPost