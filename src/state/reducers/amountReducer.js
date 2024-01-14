const reducer = (state=[], action)=>{
	if(action.type === 'USER_PROFILE_CLICK'){
		return action.payload
	}
	else if(action.type === 'USER_OTHER_CLICK'){
		return action.payload
	}
	else return state;
}
export default reducer;