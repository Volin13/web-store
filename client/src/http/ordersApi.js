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
      toast.info(
        'Ваше замовлення оформлено, чекайте на дзвінок для уточнення інформації'
      );
      return data;
    } catch (e) {
      console.log(e.response.data.message);
      return toast.error('Сталась помилка, спробуйте пізніше');
    }
  }
  return toast.error('Авторизуйтесь для оформлення замовлення');
};

export const fetchNewOrders = async () => {
  try {
    const { data } = await $authHost.get('api/orders/new-orders');
    return data;
  } catch (e) {
    console.log(e.response.data.message);
    return toast.error('Сталась помилка спробуйте пізніше');
  }
};
export const fetchOrdersHistory = async () => {
  try {
    const { data } = await $authHost.get('api/orders/orders-history');
    return data;
  } catch (e) {
    console.log(e.response.data.message);
    return toast.error('Сталась помилка спробуйте пізніше');
  }
};
export const fetchUserOrders = async userId => {
  try {
    const { data } = await $authHost.get('api/orders/user-orders/' + userId);
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
export const checkOrder = async id => {
  try {
    const { data } = await $authHost.get(`api/orders/${id}/check`);
    return data;
  } catch (e) {
    return toast.error(e.response.data.message);
  }
};
export const declineOrder = async id => {
  try {
    const { data } = await $authHost.get(`api/orders/${id}/decline`);
    return data;
  } catch (e) {
    return toast.error(e.response.data.message);
  }
};
