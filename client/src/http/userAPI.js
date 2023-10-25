import { $host, $authHost } from './index';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
export const registration = async (email, password) => {
  try {
    const { data } = await $host.post('api/user/registration', {
      email,
      password,
      role: 'ADMIN',
    });
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
  } catch (e) {
    return toast.error(e.response.data.message);
  }
};

export const login = async (email, password) => {
  try {
    const { data } = await $host.post('api/user/login', { email, password });
    localStorage.setItem('token', data.token);
    return console.log(data.token);
  } catch (e) {
    return toast.error(e.response.data.message);
  }
};

export const check = async () => {
  const { data } = await $authHost.get('api/user/auth');
  localStorage.setItem('token', data.token);
  return jwt_decode(data.token);
};
