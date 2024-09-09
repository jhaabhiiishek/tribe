import axios from 'axios';
const api = axios.create({
	baseURL: 'http://localhost:8080/'
	// baseURL: 'https://tribe-backend-sl5g.onrender.com/',
});
export default api