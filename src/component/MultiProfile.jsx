import '../App.css';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import getCookie from './getCookie';

import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import axios from 'axios';

import api from './api';
function MultiProfile(e) {

	const actionState = useSelector(state => state.actionArea)
	const studentCookie = getCookie();
	const dispatch = useDispatch()
    const {userProfileClick,setUserPostsVisibility,setLoadingAnimation} = bindActionCreators(actionCreators, dispatch)

	const openEmailPrompt=(e)=>{
		window.location ='mailto:'+e.target.innerHTML
	}
	useEffect(()=>{
		console.log(actionState[0])
	})

	
    const handleFriendClick = (e)=>{
		console.log(e)
        userProfileClick([])
		setLoadingAnimation(1)
        setUserPostsVisibility(0)
        const studentCookie= getCookie();
        if(studentCookie!==undefined){
            api.post('/fetch_links',{
                user_id:studentCookie.user_id,
                key:e.user_id
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

    return (
		<div id='profile'>
			{actionState[0][0]&&actionState[0].map((item)=>{
				return (
				<div key={item.user_id} id='profile-main-div' className='search-result box-shadow' onClick={()=>{handleFriendClick(item)}}>
					{console.log(item.name)}
					<div id="profile-main-left">
						<div style={{fontSize: 'x-large'}}>{item.name}</div>
						<div style={{color:'blue'}}>@{item.user_id}</div>
						<div >{item.job}</div>
						<div onClick={(e)=>openEmailPrompt(e)}>{item.email}</div>
						<div style={{marginBottom:'4%',marginTop:'2%',paddingLeft:'0%'}}>
							<div className='profile-tags box-shadow' style={{display:'inline'}}>
								<img className='icon-imgs' alt='(course)' src={process.env.PUBLIC_URL+"/thesis.png"}></img>
								{item.course}
							</div>
							<div className='profile-tags box-shadow' style={{display:'inline'}}>
								<img className='icon-imgs' alt='(college)' src={process.env.PUBLIC_URL+"/academy.png"}></img>
								{item.college}
							</div>
						</div>
						<div className='profile-tags box-shadow' style={{display:'inline'}}>
							<img className='icon-imgs' alt='(city)' src={process.env.PUBLIC_URL+"/worldwide.png"}></img>
							{item.home_city}
						</div>
						<div id="tags-container">
						{(item.interests)&&(item.interests.map((interest)=>{
							return(
								<div className='profile-tags box-shadow' style={{display:'inline',backgroundColor:'rgb(0, 0, 0)',color: 'white'}}>
									{/* <img className='icon-imgs' alt='(interests)' src={process.env.PUBLIC_URL+"/hashtag.png"}/> */}
									#{interest}
								</div>
							)
						}))}
						</div>
						<div style={{display:'block',marginTop:'4%'}}>
						</div>
						<div style={{display:'inline',marginTop:'4%'}}>
							followed by
						</div>
						{(item.links)&& item.links.slice(0,2).map((link)=>{
							if(link!==studentCookie.user_id){
								return(
									<div className='profile-tags box-shadow' style={{marginBottom:'2%',marginTop:'3%',display:'inline'}}>
										<img className='icon-imgs' src={process.env.PUBLIC_URL+"/circle.png"}></img>
										@{link}
									</div>
								)
							}else{
								return(
									<>no one that you know</>
									)
								}
							})}
						{console.log(item.name)}
					</div>
				</div>)
			})}
		</div>
	)
}

export default MultiProfile