const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const sequelize = require('../db');

const ApiError = require('../error/ApiError');
const { Device, DeviceInfo, DeviceImages } = require('../models/models');
class DeviceController {
  // СТВОРЕННЯ
  async create(req, res, next) {
    try {
      // Створюємо новий девайс
      let { name, price, brandId, typeId, info, rating } = req.body;
      const { mainImg } = req.files;
      const images = req.files;
      // зберігаємо основне фото
      let mainFileName = uuid.v4() + '.jpg';
      mainImg.mv(path.resolve(__dirname, '..', 'static', mainFileName));

      // створюємо девайс
      const device = await Device.create({
        name,
        price,
        rating,
        brandId,
        typeId,
        mainImg: mainFileName,
      });

      // Зберігаємо додаткові фотографії та пов'язуємо їх з девайсом
      const imageFiles = Object.keys(images)
        .filter(key => key.startsWith('images['))
        .map(key => images[key]);

      for (const image of imageFiles) {
        let fileName = uuid.v4() + '.jpg';
        image.mv(path.resolve(__dirname, '..', 'static', fileName));

        await DeviceImages.create({ fileName, deviceId: device.id });
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

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  // РЕДАГУВАННЯ
  async edit(req, res, next) {
    try {
      let {
        name,
        price,
        brandId,
        typeId,
        info,
        rating,
        deviceImagesNames,
        oldMainImg,
        oldDeviceImages,
      } = req.body;

      const { id } = req.params;
      const images = req.files;
      const mainImg = req.files && req.files.mainImg ? req.files.mainImg : null;
      const t = await sequelize.transaction();

      const device = await Device.findByPk(id);
      if (!device) {
        return next(ApiError.notFound(`Device with id ${id} not found`));
      }
      // Оновлення основних властивостей девайсу
      device.name = name;
      device.price = price;
      device.brandId = brandId;
      device.typeId = typeId;
      device.rating = rating;

      // Перевірка чи існує девайс з заданим ідентифікатором

      if (mainImg) {
        await Device.update(
          { mainImg: mainImg },
          {
            where: { id: id },
            returning: true, // Дозволяє повертати оновлені дані
            plain: true, // Дозволяє отримати лише оновлений запис, а не масив
          },
        );

        // Функція для видалення файлу
        function deleteFile(filePath) {
          try {
            fs.unlinkSync(filePath);
            console.log(`File ${filePath} deleted successfully.`);
          } catch (error) {
            console.error(`Error deleting file ${filePath}:`, error);
          }
        }

        // Припустимо, що ви маєте шлях до старого mainImg
        const oldMainImgPath = path.resolve(
          __dirname,
          '..',
          'static',
          oldMainImg,
        );

        // Виклик функції для видалення старого mainImg
        deleteFile(oldMainImgPath);
      }
      // Зберігаємо зміни в основному девайсі
      await device.save();
      // знаходимо нові зображення
      const imageFiles =
        images?.map &&
        Object.keys(images)
          .filter(key => key.startsWith('images['))
          .map(key => images[key]);

      // Зберігаємо додаткові фотографії та пов'язуємо їх з девайсом
      if (imageFiles?.length) {
        for (const image of imageFiles) {
          let fileName = uuid.v4() + '.jpg';
          image.mv(path.resolve(__dirname, '..', 'static', fileName));

          await DeviceImages.create({ fileName, deviceId: device.id });
        }
      }
      // Видалення існуючих фотографій за ідентифікаторами
      const newNames = JSON.parse(deviceImagesNames);
      const oldNames = JSON.parse(oldDeviceImages);
      if (newNames) {
        await Promise.all(
          oldNames.map(async name => {
            const oldMainImgPath = path.resolve(
              __dirname,
              '..',
              'static',
              name,
            );
            const includesFile = newNames.includes(name);
            if (!includesFile) {
              await deleteFile(oldMainImgPath);
            }
          }),
        );
      }

      try {
        // Видалення існуючих записів для deviceId
        await DeviceInfo.destroy({ where: { deviceId: id }, transaction: t });

        // Додавання нової інформації
        info = JSON.parse(info);
        await Promise.all(
          info.map(i =>
            DeviceInfo.create(
              {
                title: i.title,
                description: i.description,
                deviceId: id,
              },
              { transaction: t },
            ),
          ),
        );

        // Збереження транзакції
        await t.commit();
      } catch (error) {
        // Відкат транзакції у разі помилки
        await t.rollback();
        throw error; // Перенаправлення помилки наверх для обробки вище
      }
      return res.json({ message: 'Device updated successfully', device });
    } catch (e) {
      next(
        ApiError.badRequest(
          e.message,
          'при редагуванні сталась помилка, спробуйте пізніше',
        ),
      );
    }
  }

  // ДІСТАЄМО ВСІ
  async getAll(req, res, next) {
    try {
      let { brandId, typeId, query, limit, page, order } = req.query;
      order = order || [];
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
      // сортування девайсів
      let filterArr = [
        ['inStock', 'DESC'], // потім девайси з inStock===false
        ['discount', 'DESC'], // спочатку девайси з discount===true
        ['price', 'DESC'],
      ];
      if (order.includes('priceDesc')) {
        filterArr.unshift(['price', 'ASC']);
      }
      if (order.includes('ratingDesc')) {
        filterArr.unshift(['rating', 'DESC']);
      }
      const devices = await Device.findAndCountAll({
        where: whereCondition,
        order: filterArr,
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
  }
}

module.exports = new DeviceController();
