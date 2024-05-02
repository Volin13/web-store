import axios from 'axios';
import {
  startTokenRefreshInterval,
  stopTokenRefreshInterval,
} from './checkAuthInterval';
import { refreshTokens } from './userAPI';

const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// const authInterceptor = config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
//     return config;
//   } else {
//     return toast.info('Авторизуйтесь будь-ласка');
//   }
// };

// $authHost.interceptors.request.use(authInterceptor);

let isRefreshing = false;
let failedRequests = [];

export const setupInterceptors = store => {
  $authHost.interceptors.request.use(
    config => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${localStorage.getItem(
          'accessToken'
        )}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  $authHost.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          try {
            const accessToken = await new Promise((resolve, reject) => {
              failedRequests.push({ resolve, reject });
            });
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return $authHost(originalRequest);
          } catch (error) {
            return Promise.reject(error);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');

          const data = await refreshTokens(refreshToken);
          stopTokenRefreshInterval();
          store.setRefreshToken(data.refreshToken);
          store.setAccessToken(data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          startTokenRefreshInterval(store, data.refreshToken);
          const result = await $authHost(originalRequest);

          for (const request of failedRequests) {
            request.resolve(data.accessToken);
          }
          failedRequests = [];

          return result;
        } catch (err) {
          failedRequests = [];
          stopTokenRefreshInterval();
          store.setRefreshToken('');
          store.setAccessToken('');
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );
};

export { $host, $authHost };
