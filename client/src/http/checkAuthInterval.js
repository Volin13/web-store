import { refreshTokens } from './userAPI';

export const startTokenRefreshInterval = (store, refreshToken) => {
  const interval = setInterval(async () => {
    try {
      const data = await refreshTokens(refreshToken);
      if (!data) {
        store.setRefreshToken('');
        store.setAccessToken('');
        stopTokenRefreshInterval();
      }
      store.setRefreshToken(data.refreshToken);
      store.setAccessToken(data.accessToken);
    } catch (error) {
      console.log(error);
    }
  }, 4.2 * 60 * 1000);
  localStorage.setItem('refreshTokenInterval', interval);
};

export const stopTokenRefreshInterval = () => {
  const interval = localStorage.getItem('refreshTokenInterval');
  if (!interval) return;
  clearInterval(interval);
  localStorage.removeItem('refreshTokenInterval');
};
