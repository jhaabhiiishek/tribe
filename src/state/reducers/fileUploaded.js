const reducer = (state=[], action)=>{
	if(action.type === 'FILE_UPLOADED'){
		if(action.payload.length===0)return state;
		return action.payload
	}
	else return state;
}
export default reducer;