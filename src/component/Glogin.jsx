import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import getCookie  from './getCookie'

const client_id = "128331685413-1rh7e21p5hfq813q7i0j5rs639e8ckpg.apps.googleusercontent.com"
const secret = process.env.SECRET
console.log(client_id)

function GLogin(){

	const onSuccess=(res)=>{
		const authCode = res.code;
		api.post('/login',{
			user_id:loginusername,
			g_pass:loginpassword 
			}, {
			withCredentials: true,
			}).then(response => {
			if(response.data.success===1){
				const valueObj = {
					"user_id":response.data.user_id
				}
				const value = JSON.stringify(valueObj)
				Cookies.set("student",value,{ expires: 7 });
				const cookie = getCookie()
				console.log(cookie)
				console.log(nullCookieState)
				
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