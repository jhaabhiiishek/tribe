import {GoogleLogin} from 'react-google-login';

const client_id = "128331685413-1rh7e21p5hfq813q7i0j5rs639e8ckpg.apps.googleusercontent.com"
const secret = process.env.SECRET
console.log(client_id)
function GLogin(){

	const onSuccess=(res)=>{
		console.log("Login SUccess ",res.profileObj)
	}
	const onFailure=(res)=>{
		console.log("Login Failed ",res)
	}
	return(
		<div id="signInButton">
			<GoogleLogin 
				clientId={client_id}
				buttonText='Login'
				onSuccess={onSuccess}
				onFailure={onFailure}
				cookiePolicy={'single_host_origin'}
				isSignedIn={true}
			/>
		</div>
	)
}
export default GLogin