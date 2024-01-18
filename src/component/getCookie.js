import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

const getCookie = () => {
  
  try {
      const value = Cookies.get('student')
      console.log(value)
      JSON.parse(value)
      // const decodedToken = jwt_decode(value, process.env.REACT_APP_FIREBASE_TOKEN_KEY);
      return value
    } catch (error) {
		  return undefined 
    }
};


export default getCookie;