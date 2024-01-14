const reducer = (state=[], action)=>{
	console.log('nnnnSET_SELECTED_POST')
	if(action.type === 'SET_SELECTED_POST'){
		return action.payload
	}
	else return state;
}
export default reducer;