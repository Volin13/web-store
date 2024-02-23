import axios from 'axios';
import { toast } from 'react-toastify';

const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const authInterceptor = config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  } else {
    return toast.info('Авторизуйтесь будь-ласка');
  }
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
