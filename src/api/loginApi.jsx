import axios from 'axios';
import config from '../config/config';

const API_Base_URL = config.API_Base_URL + 'Auth';

const loginApi = {
  login: (credentials) => axios.post(`${API_Base_URL}/login`, credentials),
};

export default loginApi;