import axios from 'axios';
function api(){
	const api = axios.create({
		baseURL: 'https://tribe.azurewebsites.net',
	});
	return api;
}

export default api