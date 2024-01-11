const uuid = require('uuid');
const path = require('path');
const { Op } = require('sequelize');
const ApiError = require('../error/ApiError');
const { Device, DeviceInfo } = require('../models/models');
class DeviceController {
  async create(req, res, next) {
    try {
      // Створюємо новий девайс
      let { name, price, brandId, typeId, info, rating } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));
      const device = await Device.create({
        name,
        price,
        rating,
        brandId,
        typeId,
        img: fileName,
      });
      // Додаткова інформація має декілька пунктів

      if (info) {
        info = JSON.parse(info);
        info.forEach(i =>
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id,
          }),
        );
      }

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { brandId, typeId, query, limit, page } = req.query;
      page = page || 1;
      limit = limit || 12;
      const offset = page * limit - limit;

      const whereCondition = {};

      if (brandId) {
        whereCondition.brandId = brandId;
      }
      if (typeId) {
        whereCondition.typeId = typeId;
      }
      if (query) {
        whereCondition.name = {
          [Op.iLike]: `%${query}%`,
        };
      }

      const devices = await Device.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
      });
      return res.json(devices);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res) {
    // Отримуємо девайс за його айді

    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: 'info' }],
    });
    return res.json(device);
  }
}

module.exports = new DeviceController();
