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
      login,
    });
    return data;
  } catch (e) {
    console.log(e.response.data.message);
    toast.error('Сталась помилка, спробуйте пізніше');
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
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
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
// export const postResendLink = async info => {
//   try {
//     const { data } = await $host.post(`/users/reset/send-reset-link`, info);
//     return data;
//   } catch (error) {
//     console.log(error.message);
//     return null;
//   }
// };
export const postSetNewPassword = async info => {
  try {
    const { data } = await $host.post(`api/user/set-new-password`, info);
    return data;
  } catch (error) {
    console.log(error.message);
    return null;
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
