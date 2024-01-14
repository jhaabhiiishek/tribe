const reducer = (state=[], action)=>{
	if(action.type === 'SET_CONNECTED_USERS'){
		return action.payload
	}
	else return state;
}
export default reducer;