import { $host, $authHost } from './index';
import { toast } from 'react-toastify';

export const fetchAllComments = async (date = '', page, limit) => {
  try {
    const { data } = await $host.get('api/comments/', {
      params: {
        date,
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
    if (user?.isAuth) {
      const { data } = await $authHost.post('api/comments', {
        params: {
          deviceId: Number(deviceId),
          userId: user.id,
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
export const createReply = async (commentId, user, text) => {
  try {
    const { data } = await $authHost.post('api/replies', {
      params: {
        commentId: Number(commentId),
        userId: user.id,
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
          userId: user.id,
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
export const editReply = async (replyId, user, text) => {
  try {
    const { data } = await $authHost.patch('api/replies/' + replyId, {
      params: {
        userId: user.id,
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
          userId: user.id,
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
export const deleteReply = async (replyId, user, text) => {
  try {
    const { data } = await $authHost.delete('api/replies/' + replyId, {
      params: {
        userId: user.id,
      },
    });
    toast.success(`Коментар ${text} було видалено`);

    return data;
  } catch (error) {
    console.log(error);
    return toast.error('При видаленні коментаря сталась помилка');
  }
};
