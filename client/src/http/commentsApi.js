import { $host, $authHost } from './index';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';

const token = localStorage.getItem('token');
const decodeToken = jwt_decode(token);
export const userId = decodeToken.id || 1;

export const fetchDeviceComments = async (deviceId, page, limit) => {
  try {
    const { data } = await $host.get('api/comments/' + deviceId, {
      params: {
        limit,
        page,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return toast.error(error.response.data.message);
  }
};

export const createComment = async (deviceId, user, text) => {
  try {
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
  } catch (error) {
    console.log(error);
    return toast.error(error.response.data.message);
  }
};
export const createReply = async (commentId, text) => {
  try {
    const { data } = await $authHost.post('api/replies', {
      params: {
        commentId: Number(commentId),
        userId: userId,
        text,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return toast.error(error.response.data.message);
  }
};

export const editComment = async (commentId, user, text) => {
  try {
    if (user) {
      const { data } = await $authHost.patch('api/comments/' + commentId, {
        params: {
          userId: userId,
          text,
        },
      });
      return data;
    }
  } catch (error) {
    console.log(error);
    return toast.error(error.response.data.message);
  }
};
export const editReply = async (replyId, text) => {
  try {
    const { data } = await $authHost.patch('api/replies/' + replyId, {
      params: {
        userId: userId,
        text,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return toast.error(error.response.data.message);
  }
};

export const deleteComment = async (commentId, user, text) => {
  try {
    if (user) {
      const { data } = await $authHost.delete('api/comments/' + commentId, {
        params: {
          userId: userId,
        },
      });
      toast.success(`Коментар ${text} було видалено`);
      return data;
    }
  } catch (error) {
    console.log(error);
    return toast.error(error.response.data.message);
  }
};
export const deleteReply = async (replyId, text) => {
  try {
    const { data } = await $authHost.delete('api/replies/' + replyId, {
      params: {
        userId: userId,
      },
    });
    toast.success(`Коментар ${text} було видалено`);

    return data;
  } catch (error) {
    console.log(error);
    return toast.error('При видаленні коментаря сталась помилка');
  }
};
