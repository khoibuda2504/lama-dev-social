import axios from 'axios'
import { getFromLS } from './session';

const instance = axios.create({})
const ISSERVER = typeof window === 'undefined'

instance.interceptors.request.use(
  (config) => {
    if (!ISSERVER) {
      const { accessToken } = getFromLS("user");
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      localStorage.setItem('user', null)
      return window.location.href = '/login'
    }
    if (error.response.status === 403) {
      const { refreshToken } = getFromLS("user");
      console.log('refreshToken:::::', refreshToken)
      instance.post('/refresh', { refreshToken })
    }
    return Promise.reject(error);
  });

export default instance;
