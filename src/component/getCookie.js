import jwt_decode from 'jwt-decode';

const getCookie = () => {
    const value = document.cookie;
	
    try {
      const decodedToken = jwt_decode(value, process.env.TOKEN_KEY);
      console.log(decodedToken)
      return decodedToken
    } catch (error) {
		console.log(error)
		return 
    }
};


export default getCookie;