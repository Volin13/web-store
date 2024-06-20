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
  try {
    const { data } = await $authHost.post('api/device', device, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.info('Девайс успішно створено');
    if (data) return data;
  } catch (e) {
    toast.error(e.response.data.message);
    return console.log(e);
  }
};

export const editDevice = async (id, device) => {
  const { data } = await $authHost.patch('api/device/' + id, device, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const createRating = async (deviceId, rate, user) => {
  if (user) {
    const token = localStorage.getItem('accessToken');
    let decodeToken = { id: null };
    if (token && token !== 'superuser') {
      decodeToken = jwt_decode(token);
    }
    const userId = decodeToken.id;
    try {
      const { data } = await $authHost.post('api/rating', {
        deviceId,
        userId: userId,
        rate: Number(rate),
      });
      toast.success('Дякую за вашу оцінку');
      return data;
    } catch (e) {
      return toast.error(e.response.data.message);
    }
  }
  toast.info('Будь ласка, спочатку увійдіть в свій аккаунт');
  return;
};

export const fetchDevices = async (
  typeId,
  brandId,
  query,
  page,
  limit = 5,
  order = []
) => {
  const { data } = await $host.get('api/device', {
    params: {
      typeId,
      brandId,
      query,
      page,
      limit,
      order,
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
