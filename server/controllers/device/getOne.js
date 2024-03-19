const ApiError = require('../../error/ApiError');
const { Device, DeviceInfo, DeviceImages } = require('../../models/models');

const getOne = async (req, res, next) => {
  // Отримуємо девайс за його айді

  const { id } = req.params;
  const device = await Device.findOne({
    where: { id },
    include: [
      {
        model: DeviceInfo,
        as: 'info',
      },
      {
        model: DeviceImages,
        as: 'deviceImages',
      },
    ],
  });

  if (!device) {
    return next(ApiError.badRequest(e.message));
  }
  return res.json(device);
};

module.exports = getOne;
