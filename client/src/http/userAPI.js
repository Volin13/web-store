import { $host, $authHost } from './index';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';

const token = localStorage.getItem('accessToken');
let decodeToken = { id: '' };
if (token && token !== 'superuser') {
  decodeToken = jwt_decode(token);
}
export const userId = decodeToken.id !== '' ? decodeToken.id : 1;

export const registration = async (email, password, login) => {
  try {
    const { data } = await $host.post('api/user/registration', {
      email,
      password,
      login,
    });
    return data;
  } catch (e) {
    console.log(e.response.data.message);
    toast.error(e.response.data.message);
    return;
  }
};
export const verificateUser = async verificationToken => {
  try {
    const { data } = await $host.get(`/verify/${verificationToken}`);
    toast.success(`${data.message}!`);
    return data;
  } catch (e) {
    console.log(e.response.data.message);
    toast.error(e.response.data.message);
    return;
  }
};
export const verifyResendEmail = async () => {
  try {
    const { data } = await $host.get(`/verify/resend-email`);
    toast.success(`${data.message}!`);
    return data;
  } catch (e) {
    console.log(e.response.data.message);
    toast.error(e.response.data.message);
    return;
  }
};

export const logIn = async (email, password) => {
  try {
    const { data } = await $host.post('api/user/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (e) {
    console.log(e.response.data.message);
    toast.error(e.response.data.message);
    return;
  }
};
export const loginWithGoogle = async googleAuthToken => {
  try {
    const { data } = await $host.post('api/user/login-google', {
      googleAuthToken,
    });
    toast.success(`Вітаю!`);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (error) {
    if (error.response.status === 401) {
      toast.error(
        `${error.response?.data?.message ?? 'Email не підтверджено'}!`
      );
    }
    if (error.response.status === 403) {
      toast.error(
        `${
          error.response?.data?.message ??
          'Невірний Email або пароль, спробуйте ще раз'
        }!`
      );
    }

    if (error.response.status === 400) {
      toast.error(
        `${
          error.response?.data?.message ?? 'Сталась помилка, спробуйте ще раз'
        }!`
      );
    }
    return error.message;
  }
};

export const postResetPassword = async info => {
  try {
    const { data } = await $host.post(`api/user/reset-password`, info);
    return data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
export const resendEmailAuth = async (email, password) => {
  try {
    const { data } = await $host.post(`api/user/verify/resend-email`, {
      email,
      password,
    });
    return data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
export const postSetNewPassword = async info => {
  try {
    const { data } = await $host.post(`api/user/set-new-password`, info);
    return data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const refreshTokens = async refreshToken => {
  try {
    const { data } = await $authHost.post('api/user/refresh', { refreshToken });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (error) {
    console.log(error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return;
  }
};
export const check = async () => {
  try {
    const { data } = await $authHost.get('api/user/auth');
    return data;
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

export const changeUserData = async (userId, login, file) => {
  const formData = new FormData();
  formData.append('login', login);
  formData.append('avatar', file);
  try {
    const { data } = await $authHost.patch(
      'api/user/auth/set-user-info/' + userId,
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
