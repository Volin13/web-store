import { $host, $authHost } from './index';
import jwt_decode from 'jwt-decode';

const token = localStorage.getItem('token');
const decodeToken = jwt_decode(token);
const userId = decodeToken.id;

export const createType = async type => {
  const { data } = await $authHost.post('api/type', type);
  return data;
};

export const fetchDeviceComments = async (deviceId, page, limit) => {
  const { data } = await $host.get('api/comments/' + deviceId, {
    params: {
      limit,
      page,
    },
  });
  return data;
};

export const createComment = async (deviceId, user, text) => {
  if (user) {
    const { data } = await $authHost.post('api/comments', {
      params: {
        deviceId,
        userId: userId,
        text,
      },
    });
    return data;
  }
};
export const createReply = async (commentId, text) => {
  const { data } = await $authHost.post('api/replies', {
    params: {
      commentId,
      userId: userId,
      text,
    },
  });
  return data;
};

export const editComment = async (id, user, text) => {
  if (user) {
    const { data } = await $authHost.post('api/comments' + id, {
      params: {
        userId: userId,
        text,
      },
    });
    return data;
  }
};
export const editReply = async (commentId, text) => {
  const { data } = await $authHost.post('api/replies' + commentId, {
    params: {
      userId,
      text,
    },
  });
  return data;
};

export const deleteComment = async (deviceId, user, text) => {
  if (user) {
    const { data } = await $authHost.post('api/comments', {
      params: {
        deviceId,
        userId: userId,
        text,
      },
    });
    return data;
  }
};
export const deleteReply = async (commentId, userId, text) => {
  const { data } = await $authHost.post('api/replies', {
    params: {
      commentId,
      userId,
      text,
    },
  });
  return data;
};
