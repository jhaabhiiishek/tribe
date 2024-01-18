const reducer = (state=[], action)=>{
	if(action.type === 'SET_SENT_REQUESTS'){
		if(action.payload.length===0)return state;
		return action.payload
	}
	else return state;
}
export default reducer;