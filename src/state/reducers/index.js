import { combineReducers } from "redux";
import amountReducer from "./amountReducer";
import selfPostReducer from "./selfPostReducer";
import nullCookieReducer from "./nullCookieReducer";
import likedPostsReducer from "./likedPostsReducer";
import connectedUserReducer from "./connectedUserReducer";
import selectedPostReducer from "./selectedPostReducer";
import likedCommentsReducer from "./likedCommentsReducer";
import sentRequestReducer from "./sentRequestReducer";
import loadingReducer from "./loadingReducer";
import fileUploadedReducer from "./fileUploadedReducer";

const reducers = combineReducers({
	actionArea:amountReducer,
	selfPost:selfPostReducer,
	nullCookie:nullCookieReducer,
	likedPosts:likedPostsReducer,
	connectedUser:connectedUserReducer,
	selectedPost:selectedPostReducer,
	likedComments:likedCommentsReducer,
	sentRequests:sentRequestReducer,
	isComponentLoading:loadingReducer,
	fileUploaded:fileUploadedReducer
})

export default reducers;