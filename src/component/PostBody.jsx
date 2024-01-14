import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getCookie from './getCookie';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector,useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

const api = axios.create({
    baseURL: 'https://tribe.azurewebsites.net',
});
function PostBody(e) {
    
    const dispatch = useDispatch()
    const {userProfileClick,setUserPostsVisibility,setSelectedPost,setSentRequests,setConnectedUsers} = bindActionCreators(actionCreators, dispatch)
    const likedPosts = useSelector(state=> state.likedPosts)
    const connects = useSelector(state=> state.connectedUser)
    const selectedPost = useSelector(state=>state.selectedPost)
    const sentRequests = useSelector(state=>state.sentRequests)


    const index= e.keyValue
    const data = e.data
    const student = getCookie()
    const [likes,setLikes]=useState(0)
    const [comment_value,setComment]= useState('')
    const [bgCol,setBgCol]= useState('')
    const [conBgCol,setConBgCol]= useState('')
    const [post_date,setPostDate]= useState('')
    
    useEffect(()=>{
        setLikes(data.upvotes)
        const current = new Date()
        const date = new Date(data.upload_date).toLocaleString('en-US', { month: 'short' });
        const day = new Date(data.upload_date).toLocaleString('en-US', { day: '2-digit' });
        const year = new Date(data.upload_date).toLocaleString('en-US', { year: 'numeric' });
        if(year!==current.getFullYear()){
            setPostDate(day+' '+date+', '+year)
        }else{
            setPostDate(day+' '+date)
        }
        setConnectedUsersfn()
        setColor()
    }, []);
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
            notifySuccess(response)
        });
        setComment('')
    }

    const setColor = ()=>{
        var newObj = {
            post_user_id:data.user_id,
            post_user_post_id:data.user_post_id
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
            var colString = 'rgb(229, 99, 99)'
            setBgCol(colString)
        }else{
            setBgCol('#bdb9b9')
        }
    }
    const setConnectedUsersfn = ()=>{
        if(!connects.includes(data.user_id,0)){
            var colString = 'rgb(120, 169, 233)'
            setConBgCol(colString)
        }else{
            var colString = 'rgb(225,225,225)'
            setConBgCol(colString)
        }
    }
    const setSentLinks = ()=>{
        if(!sentRequests.includes(data.user_id,0)){
            var colString = 'rgb(120, 169, 233)'
            setConBgCol(colString)
        }else{
            var colString = 'rgb(225,225,225)'
            setConBgCol(colString)
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
            posted_by:data.user_id,
            user_post_id:data.user_post_id
        }, {
            withCredentials: true,
        }).then(response => {
            setLikes(response.data.likes)
        });
    }

    const connectClick = async()=>{
        if(connects.includes(data.user_id,0)){
            console.log('true tha')
            await api.post('/removelink',{
                user_id:student.user_id,
                other_uid:data.user_id
            }, {
                withCredentials: true,
            }).then(response => {
                if(response.data.success===1){
                    var arr = sentRequests
                    var value=data.user_id
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
            post_by_user_id:data.user_id,
            user_post_id:data.user_post_id,
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
        <div key={index} id='post' style={{wordWrap: 'break-word',paddingBottom:'1%'}}>
            <div id='post-user_id'>
                <h3 onClick={()=>{handleFriendClick(data.user_id)}} style={{fontWeight: "500",width:'max-content',padding: "1%"}}>{data.user_id}</h3>
                {(data.user_id!==student.user_id)?(
                    <div id='link-div' onClick={()=>connectClick()} style={{backgroundColor:conBgCol,border:"0.5px solid black"}}>
                        <img src={process.env.PUBLIC_URL+"/link-minimalistic-svgrepo-com.svg"} style={{display:'inline'}}></img>
                        <h4 id='post-upvotes' style={{display:"inline",fontWeight:"300",paddingLeft:'3.5%',paddingRight:'3.5%'}}> {!sentRequests.includes(data.user_id,0)?(connects.includes(data.user_id,0)?('connected'):('connect')):('sent')}</h4>
                    </div>
                ):(<></>)}
            </div>
            <h3 id='post-text' onClick={()=>displaySelectedPost(data)}>{data.text}</h3>
            <div id='like-div'  onClick={(e)=>likePost(e)} style={{backgroundColor:bgCol}}>
                {/*<a id="like-anchor" > */}
                    <img id="like-image" src={process.env.PUBLIC_URL+"/notifications.png"}>
                    </img>
                {/* </a> */}
                <h4 id='post-upvotes'> {likes} likes</h4>
            </div>
            <div id='like-div'>
                {/* Comment */}
                <img id="like-image" onClick={()=>displaySelectedPost(data)} style={{width:'1.1rem'}} src={process.env.PUBLIC_URL+"/comments-alt-svgrepo-com.svg"}></img>
            </div>
            <div id='like-div'>
                <h4 id='post-upvotes'><span style={{color:'green'}}>● </span>{post_date}</h4>
            </div>
            {/* <h3 id='post-comment_id'>{data.comment_id}</h3> */}
            <form id='comment'>
                <input id='comment-prompt' type='text' required onChange={(e)=>setComment(e.target.value)} value={comment_value} placeholder='comment...'></input>
                <button type='submit' onClick={(e)=>postComment(e,data.user_id,data.user_post_id)}id='comment-post' style={{marginBottom:'0px',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
                    <div style={{marginLeft:"15%"}}>Post</div>
                    <img src={process.env.PUBLIC_URL+"/send-svgrepo-com.svg"}></img>
                </button>
            </form>
            <ToastContainer/>
        </div>
    )
}

export default PostBody