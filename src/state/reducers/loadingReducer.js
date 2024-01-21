const reducer = (state=0, action)=>{
	if(action.type === 'SET_LOADING'){
		return action.payload
	}
	else return state;
}
export default reducer;