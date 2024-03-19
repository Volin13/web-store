const { User } = require('../../models/models');
const ApiError = require('../../error/ApiError');
const { saveImage, deleteImage } = require('../../helpers');

const changeUserData = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { login } = req.body;
    const { avatar } = req.files;

    let user = await User.findOne({
      where: { id: Number(userId) },
    });

    if (!user) {
      return next(ApiError.notFound('Користувача не знайдено'));
    }

    if (login && login !== user.login) {
      user.login = login;
    }

    if (!avatar) {
      return res.json(user);
    } else {
      const saveAvatarURL = async result => {
        const avatar = result.secure_url;
        user.avatar = avatar;
      };
      try {
        await saveImage(buffer, saveAvatarURL, userId);
      } catch (error) {
        console.error('Помилка при збереженні зображення: ', error.message);
        return next(
          ApiError.internal('Сталась помилка під час збереження зображення'),
        );
      }

      try {
        await deleteImage(user.avatar);
      } catch (error) {
        console.error('Помилка під час видалення зображення: ', error.message);
      }
      return res.json({ login: user.login, avatar: user.avatar });
    }
  } catch (error) {
    console.error('Помилка: ', error.message);
    return next(ApiError.internal('Сталась помилка, спробуйте пізніше'));
  }
};

module.exports = changeUserData;
