const reducer = (state=[], action)=>{
	if(action.type === 'SET_SENT_REQUESTS'){
		return action.payload
	}
	else return state;
}
export default reducer;