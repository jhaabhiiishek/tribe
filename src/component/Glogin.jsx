const client_id = "128331685413-1rh7e21p5hfq813q7i0j5rs639e8ckpg.apps.googleusercontent.com"
const secret = process.env.SECRET
console.log(client_id)
function GLogin(){

	const onSuccess=(res)=>{
		console.log("Login SUccess ",res.profileObj)
		console.log("Login SUccess ",res)
	}
	const onFailure=(res)=>{
		console.log("Login Failed ",res)
	}
	return(
		<>
			<div id="g_id_onload"
				data-client_id="128331685413-1rh7e21p5hfq813q7i0j5rs639e8ckpg.apps.googleusercontent.com"
				data-context="signup"
				data-ux_mode="popup"
				data-callback="onSuccess"
				data-auto_select="true"
				data-itp_support="true">
			</div>

			<div class="g_id_signin"
				data-type="standard"
				data-shape="rectangular"
				data-theme="outline"
				data-text="signin_with"
				data-size="large"
				data-logo_alignment="left">
			</div>
		</>
	)
}
export default GLogin