const reducer = (state=[], action)=>{
	if(action.type === 'SET_LIKED_COMMENTS'){
		return action.payload
	}
	else return state;
}
export default reducer;