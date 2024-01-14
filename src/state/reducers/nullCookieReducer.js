const reducer = (state=1, action)=>{
	if(action.type === 'SET_NULL_COOKIE'){
		return action.payload
	}
	else return state;
}
export default reducer;