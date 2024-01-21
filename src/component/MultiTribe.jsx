import '../App.css';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import getCookie from './getCookie';

import axios from 'axios';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

const api = axios.create({
    baseURL: 'https://tribe-backend-sl5g.onrender.com/',
});

function MultiTribe(e) {
	const actionState = useSelector(state => state.actionArea)
	const dispatch = useDispatch()
    const {userProfileClick,setUserPostsVisibility,setLoadingAnimation} = bindActionCreators(actionCreators, dispatch)


	const handleTribeClick = async (e)=>{
        userProfileClick([])
        setLoadingAnimation(1)
        setUserPostsVisibility(0)
        const studentCookie= getCookie();
        if(studentCookie!==undefined){
            var emptyArray = []
            await api.post('/search_tribe',{
                user_id:studentCookie.user_id,
                tribe_id:e.tribe_id
            },{
                withCredentials: true
            }).then(async (response) =>  {
                emptyArray.push(response.data.data)

                await api.post('/fetch_tribe_post',{
                    user_id:studentCookie.user_id,
                    tribe_id:e.tribe_id
                },{
                    withCredentials: true
                }).then((res) => {
                    emptyArray.push(res.data.data)
                })
                setLoadingAnimation(0)
                userProfileClick(emptyArray)
            })
        }
    }
	
    return (
		<div id='profile'>
			{actionState.map((item)=>{
				return(
					<div id='profile-main-div' className='search-result box-shadow' onClick={()=>{handleTribeClick(item)}}>
                    <div id="profile-main-left">

                        <div style={{fontSize: 'x-large'}}>{item.name}</div>
                        <div style={{marginBottom:'2.5%'}}>made by {item.creator}</div>
                            <div className='profile-tags box-shadow' style={{display:'inline'}}>
                                {item.tribe_type}
                            </div>
                            {(item.tags)&&(item.tags.map((interest)=>{
                                return(
                                    <div className='profile-tags box-shadow' style={{display:'inline',backgroundColor:'rgb(0, 0, 0)',color: 'white'}}>
                                    {/* <img className='icon-imgs' alt='(interests)' src={process.env.PUBLIC_URL+"/hashtag.png"}/> */}
                                    #{interest}
                                    </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
				)
			})}
		</div>
	)
}

export default MultiTribe