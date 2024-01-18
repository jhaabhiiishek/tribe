import { act } from "react-dom/test-utils";

const reducer = (state=[], action)=>{
	if(action.type === 'SET_LIKED_POSTS'){
		if(action.payload&&action.payload.length===0)return state;
		return action.payload
	}
	else return state;
}
export default reducer;