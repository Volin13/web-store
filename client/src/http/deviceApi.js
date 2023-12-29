import { $host, $authHost } from './index';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';

export const createType = async type => {
  const { data } = await $authHost.post('api/type', type);
  return data;
};

export const fetchTypes = async () => {
  const { data } = await $host.get('api/type');
  return data;
};
export const createBrand = async brand => {
  const { data } = await $authHost.post('api/brand', brand);
  return data;
};

export const fetchBrands = async () => {
  const { data } = await $host.get('api/brand');
  return data;
};

export const fetchRatings = async () => {
  const { data } = await $host.get('api/rating');
  return data;
};

export const createDevice = async device => {
  const { data } = await $authHost.post('api/device', device);
  return data;
};
export const createRating = async (deviceId, rate, user) => {
  if (user) {
    const token = localStorage.getItem('token');
    const decodeToken = jwt_decode(token);
    const userId = decodeToken.id;
    try {
      const { data } = await $authHost.post('api/rating', {
        deviceId,
        userId: userId,
        rate,
      });
      return data;
    } catch (e) {
      return toast.info(e.response.data.message);
    }
  }
  toast.info('Будь-ласка спочатку увійдіть в свій аккаунт');
  return;
};

export const fetchDevices = async (typeId, brandId, query, page, limit = 5) => {
  const { data } = await $host.get('api/device', {
    params: {
      typeId,
      brandId,
      query,
      page,
      limit,
    },
  });
  return data;
};
export const fetchSingleDevice = async id => {
  const { data } = await $host.get('api/device/' + id);
  return data;
};
export const getDeviceRating = async id => {
  try {
    const { data } = await $host.get('api/rating/' + id);
    return data;
  } catch (e) {
    return toast.error(e.response.data.message);
  }
};
