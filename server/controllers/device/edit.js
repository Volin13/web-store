const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const sequelize = require('../../db');

const ApiError = require('../../error/ApiError');
const { Device, DeviceInfo, DeviceImages } = require('../../models/models');

const edit = async (req, res, next) => {
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
          returning: true,
          plain: true,
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
          const oldMainImgPath = path.resolve(__dirname, '..', 'static', name);
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
};
module.exports = edit;
