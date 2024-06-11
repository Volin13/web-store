const { User } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const getUserData = async (req, res, next) => {
  try {
    // перевірка ролі при логінізації/оновленню токена
    const { userId } = req.params;

    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return next(
        ApiError.internal(
          'Користувача з вашим id не знайдено, спробуйте пізніше',
        ),
      );
    }
    return res.json(user);
  } catch (error) {
    return next(ApiError.internal('Сталась помилка, спробуйте пізніше'));
  }
};

module.exports = getUserData;
