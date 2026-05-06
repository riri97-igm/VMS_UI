import axios from 'axios';
import config from '../config/config';

const BASE = config.API_Base_URL + 'Report';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('vms_user') || '{}');
  return user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const reportApi = {
  getSummary: (from, to) => axios.get(`${BASE}/summary`, {
    headers: getAuthHeader(),
    params: { from, to },
  }),
};

export default reportApi;