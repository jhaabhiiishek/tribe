const reducer = (state=[], action)=>{
	if(action.type === 'SET_LIKED_POSTS'){
		return action.payload
	}
	else return state;
}
export default reducer;