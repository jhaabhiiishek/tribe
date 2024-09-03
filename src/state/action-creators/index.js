export const userProfileClick =(profile)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:'USER_PROFILE_CLICK',
			payload:profile
		})
	}
}
export const otherClicks =(tribe)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:'USER_OTHER_CLICK',
			payload:tribe
		})
	}
}

export const setUserPostsVisibility =(visibility)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:'SET_USER_POSTS_VISIBILITY',
			payload:visibility
		})
	}
}

export const setNullCookie =(visibility)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:'SET_NULL_COOKIE',
			payload:visibility
		})
	}
}

export const setLikedPosts =(posts)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:'SET_LIKED_POSTS',
			payload:posts
		})
	}
}

export const setLikedComments =(comments)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:'SET_LIKED_COMMENTS',
			payload:comments
		})
	}
}
export const setConnectedUsers =(connects)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:'SET_CONNECTED_USERS',
			payload:connects
		})
	}
}
export const setSelectedPost =(post)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:'SET_SELECTED_POST',
			payload:post
		})
	}
}
export const setSentRequests =(request)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:'SET_SENT_REQUESTS',
			payload:request
		})
	}
}
export const setFileUploaded =(file)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:'FILE_UPLOADED',
			payload:file
		})
	}
}
export const setLoadingAnimation =(request)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:'SET_LOADING',
			payload:request
		})
	}
}