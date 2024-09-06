import React from 'react';
import { GoogleLogin,GoogleOAuthProvider } from '@react-oauth/google';
import Cookies from 'js-cookie';
import getCookie  from './getCookie'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';


import api from './api';
function GLogin(){
	const client_id = "128331685413-1rh7e21p5hfq813q7i0j5rs639e8ckpg.apps.googleusercontent.com"
	const dispatch = useDispatch()
	const {setNullCookie} = bindActionCreators(actionCreators, dispatch)
	const onSuccess=(res)=>{
		const authCode = res;
		//write code here for accessing token
		api.post('/login',{
				g_pass:authCode 
			}, {
			withCredentials: true,
			}).then(response => {
			if(response.data.success===1){
				console.log(response)
				const valueObj = {
					"user_id":response.data.user_id
				}
				const value = JSON.stringify(valueObj)
				Cookies.set("student",value,{ expires: 7 });
				const cookie = getCookie()
				console.log(cookie)
				if(cookie!==undefined){
					setNullCookie(0)
				}
			}
		})
	}
	const onFailure=(res)=>{
		console.log("Login Failed ",res)
	}
	return(
		<GoogleLogin
			onSuccess={onSuccess}
			onError={onFailure}
			useOneTap
			flow="auth-code"
		/>
	)
}
export default GLogin