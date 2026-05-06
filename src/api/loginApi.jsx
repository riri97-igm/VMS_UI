import axios from 'axios';
import config from '../config/config';

const API_Base_URL = config.API_Base_URL + 'Auth';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('vms_user') || '{}');
  return user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const loginApi = {
  login:          (credentials) => axios.post(`${API_Base_URL}/login`, credentials),
  register:       (data)        => axios.post(`${API_Base_URL}/register`, data, { headers: getAuthHeader() }),
  changePassword: (data)        => axios.post(`${API_Base_URL}/change-password`, data, { headers: getAuthHeader() }),
  me:             ()            => axios.get(`${API_Base_URL}/me`, { headers: getAuthHeader() }),
};

export default loginApi;