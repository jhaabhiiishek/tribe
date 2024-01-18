const reducer = (state=[], action)=>{
	if(action.type === 'SET_SELECTED_POST'){
		return action.payload
	}
	else return state;
}
export default reducer;