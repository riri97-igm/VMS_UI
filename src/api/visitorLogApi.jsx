import axios from 'axios';
import config from '../config/config';

const BASE = config.API_Base_URL + 'VisitorLog';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('vms_user') || '{}');
  return user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const visitorLogApi = {
  getAll:    ()           => axios.get(BASE, { headers: getAuthHeader() }),
  getToday:  ()           => axios.get(`${BASE}/today`, { headers: getAuthHeader() }),
  getById:   (id)         => axios.get(`${BASE}/${id}`, { headers: getAuthHeader() }),
  checkIn:   (data)       => axios.post(`${BASE}/checkin`, data, { headers: getAuthHeader() }),
  checkOut:  (id, remarks)=> axios.put(`${BASE}/${id}/checkout`, { remarks }, { headers: getAuthHeader() }),
  delete:    (id)         => axios.delete(`${BASE}/${id}`, { headers: getAuthHeader() }),
};

export default visitorLogApi;
