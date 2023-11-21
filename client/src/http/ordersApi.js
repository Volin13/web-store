import { $authHost } from './index';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

export const createOrder = async (user, userData, orderList) => {
  if (user) {
    const token = localStorage.getItem('token');
    const decodeToken = jwt_decode(token);
    const userId = decodeToken.id;
    try {
      const { data } = await $authHost.post('api/orders', {
        userId,
        userData,
        orderList,
      });
      toast.error(
        'Ваше замовлення оформлено, чекайте на дзвінок для уточнення інформації'
      );
      return data;
    } catch (e) {
      return toast.error(e.response.data.message);
    }
  }
  return toast.error('Авторизуйтесь для оформлення замовлення');
};

export const fetchAllOrders = async () => {
  const { data } = await $authHost.get('api/orders');
  return data;
};
export const fetchUserOrders = async userId => {
  try {
    const { data } = await $authHost.get('api/orders/' + userId);
    return data;
  } catch (e) {
    return toast.error(e.response.data.message);
  }
};
export const fetchOrderById = async id => {
  try {
    const { data } = await $authHost.get('api/orders/' + id);
    return data;
  } catch (e) {
    return toast.error(e.response.data.message);
  }
};
