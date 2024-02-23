import { $host, $authHost } from './index';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';

const token = localStorage.getItem('token');
let decodeToken = { id: '' };
if (token) {
  decodeToken = jwt_decode(token);
}
export const userId = decodeToken.id !== '' ? decodeToken.id : 1;

export const registration = async (email, password, login) => {
  try {
    const { data } = await $host.post('api/user/registration', {
      email,
      password,
      // role: 'ADMIN',
      login,
    });
    return data;
  } catch (e) {
    console.log(e.response.data.message);
    toast.error('Сталась помилка, спробуйте пізніше');
    return;
  }
};

export const logIn = async (email, password) => {
  try {
    const { data } = await $host.post('api/user/login', { email, password });
    localStorage.setItem('token', data.token);
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

export const checkUsedLogin = async login => {
  try {
    const { data } = await $host.get('api/user/auth/loginCheck', {
      params: { login: login },
    });
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};
export const getUserData = async () => {
  try {
    const { data } = await $authHost.get('api/user/auth/data/' + userId);
    return data;
  } catch (e) {
    console.log(e);
    toast.error(e.response.data.message);
    return;
  }
};

export const changeUserData = async (userId, login, newImage) => {
  const formData = new FormData();
  formData.append('login', login);
  formData.append('avatar', newImage);
  try {
    const { data } = await $authHost.patch(
      'api/user/auth/data/' + userId,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    toast.success('Ваші дані було змінено');

    return data;
  } catch (e) {
    console.log(e);
    toast.error(e.response.data.message);

    return;
  }
};
