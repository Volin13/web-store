const uuid = require('uuid');
const path = require('path');
const { Op } = require('sequelize');
const ApiError = require('../error/ApiError');
const { Device, DeviceInfo } = require('../models/models');
class DeviceController {
  // СТВОРЕННЯ
  async create(req, res, next) {
    try {
      // Створюємо новий девайс
      let { name, price, brandId, typeId, info, rating } = req.body;
      const { images } = req.files;
      // let fileName = uuid.v4() + '.jpg';
      // img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const device = await Device.create({
        name,
        price,
        rating,
        brandId,
        typeId,
      });

      // Зберігаємо фотографії та пов'язуємо їх з девайсом
      const imageFileNames = [];
      for (const image of images) {
        const fileName = uuid.v4() + '.jpg';
        image.mv(path.resolve(__dirname, '..', 'static', fileName));
        imageFileNames.push(fileName);

        await DeviceImage.create({ fileName, deviceId: device.id });
      }

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

      // return res.json(device);
      return res.json({ device, images: imageFileNames });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  // РЕДАГУВАННЯ
  async update(req, res, next) {
    try {
      const { deviceId } = req.params;
      const { name, price, brandId, typeId, info, rating, deletedImages } =
        req.body;
      const { images } = req.files;

      // Перевірка чи існує девайс з заданим ідентифікатором
      const device = await Device.findByPk(deviceId);

      if (!device) {
        return next(ApiError.notFound(`Device with id ${deviceId} not found`));
      }

      // Оновлення основних властивостей девайсу
      device.name = name;
      device.price = price;
      device.brandId = brandId;
      device.typeId = typeId;
      device.rating = rating;

      // Зберігаємо зміни в основному девайсі
      await device.save();

      // Видалення існуючих фотографій за ідентифікаторами
      if (deletedImages && deletedImages.length > 0) {
        await DeviceImage.destroy({ where: { id: deletedImages, deviceId } });
      }

      // Додавання нових фотографій
      const imageFileNames = [];
      for (const image of images) {
        const fileName = uuid.v4() + '.jpg';
        image.mv(path.resolve(__dirname, '..', 'static', fileName));
        imageFileNames.push(fileName);

        await DeviceImage.create({ fileName, deviceId });
      }

      // Оновлення інформації про девайс
      if (info) {
        // Видалення існуючої інформації про девайс
        await DeviceInfo.destroy({ where: { deviceId } });

        // Додавання нової інформації про девайс
        info = JSON.parse(info);
        info.forEach(i =>
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId,
          }),
        );
      }

      return res.json({ message: 'Device updated successfully', device });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  // ДІСТАЄМО ВСІ
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

  // ДІСТАЄМО ОДИН
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
