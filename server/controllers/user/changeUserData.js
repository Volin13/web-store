const ApiError = require('../../error/ApiError');
const { saveImage, deleteImage } = require('../../helpers');
const { v4: uuidv4 } = require('uuid');

const changeUserData = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { login } = req.body;
    const { avatar } = req.files;
    const user = req.user;

    if (login && login !== user.login) {
      user.login = login;
    }

    if (!avatar) {
      return res.json(user);
    } else {
      try {
        const defaultAvatar =
          'https://res.cloudinary.com/dwgpcl0nu/image/upload/v1709034825/images/upload/default/vjj4nqijxlcbhxu34drg';
        if (user.avatar !== defaultAvatar) {
          await deleteImage(user.avatar);
        }
      } catch (error) {
        console.error('Помилка під час видалення зображення: ', error.message);
      }

      const saveAvatarURL = async result => {
        const avatarURL = result.secure_url;
        user.avatar = avatarURL;
        await user.save();
      };
      const options = {
        resource_type: 'image',
        public_id: `users/user_${userId}/${uuidv4()}`,
      };

      try {
        await saveImage(saveAvatarURL, avatar.data, options);
      } catch (error) {
        console.error('Помилка при збереженні зображення: ', error.message);
        return next(
          ApiError.internal('Сталась помилка під час збереження зображення'),
        );
      }

      return res.json({ login: user.login, avatar: user.avatar });
    }
  } catch (error) {
    console.error('Помилка: ', error.message);
    return next(ApiError.internal('Сталась помилка, спробуйте пізніше'));
  }
};

module.exports = changeUserData;
