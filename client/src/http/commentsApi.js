import { $host, $authHost } from './index';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';

const token = localStorage.getItem('token');
const decodeToken = jwt_decode(token);
export const userId = decodeToken.id || 1;

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
        deviceId: Number(deviceId),
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
      commentId: Number(commentId),
      userId: userId,
      text,
    },
  });
  return data;
};

export const editComment = async (commentId, user, text) => {
  if (user) {
    const { data } = await $authHost.post('api/comments/' + commentId, {
      params: {
        userId: userId,
        text,
      },
    });
    return data;
  }
};
export const editReply = async (replyId, text) => {
  const { data } = await $authHost.post('api/replies/' + replyId, {
    params: {
      userId: userId,
      text,
    },
  });
  return data;
};

export const deleteComment = async (commentId, user) => {
  try {
    if (user) {
      const { data } = await $authHost.delete('api/comments/' + commentId, {
        params: {
          userId: userId,
        },
      });
      toast.success('Коментар було видалено');
      return data;
    }
  } catch (error) {
    console.log(error);
    return toast.error(
      error.response.data.message,
      'При видаленні коментаря сталась помилка'
    );
  }
};
export const deleteReply = async (replyId, userId, text) => {
  try {
    const { data } = await $authHost.delete('api/replies/' + replyId, {
      params: {
        replyId,
        userId,
        text,
      },
    });
    toast.success('Коментар було видалено');

    return data;
  } catch (error) {
    console.log(error);
    return toast.error('При видаленні коментаря сталась помилка');
  }
};
