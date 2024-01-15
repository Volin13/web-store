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
    console.log(e.response.data.message);
    toast.error('Сталась помилка, спробуйте пізніше');
    return;
  }
};

export const login = async (email, password) => {
  try {
    const { data } = await $host.post('api/user/login', { email, password });
    localStorage.setItem('token', data.token);
    console.log(data.token);
    return jwt_decode(data.token);
  } catch (e) {
    console.log(e.response.data.message);
    toast.error(e.response.data.message);
    return;
  }
};

export const check = async () => {
  try {
    const { data } = await $authHost.get('api/user/auth');
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
  } catch (error) {
    console.log(error);
    return;
  }
};
