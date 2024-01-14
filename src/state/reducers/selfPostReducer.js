const reducer = (state=0, action)=>{
	if(action.type === 'SET_USER_POSTS_VISIBILITY'){
		return action.payload
	}
	else return state;
}
export default reducer;