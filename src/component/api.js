import axios from 'axios';
function api(){
	const api = axios.create({
		baseURL: 'http://localhost:8080/',
	});
	return api;
}

export default api