import axios from 'axios';
import config from '../config/config';

const API_Base_URL = config.API_Base_URL + "Staff";

const staffApi = {
    getAll: () => axios.get(API_Base_URL),
    getById: (id) => axios.get(`${API_Base_URL}/${id}`),
    create: (data) => axios.post(API_Base_URL, data),
    update: (id, data) => axios.put(`${API_Base_URL}/${id}`, data),
    delete: (id) => axios.delete(`${API_Base_URL}/${id}`),
};

export default staffApi;