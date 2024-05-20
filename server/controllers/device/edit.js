const { v4: uuidv4 } = require('uuid');
const sequelize = require('../../db');

const { saveImage, deleteImage } = require('../../helpers');

const ApiError = require('../../error/ApiError');
const { Device, DeviceInfo, DeviceImages } = require('../../models/models');

const edit = async (req, res, next) => {
  const t = await sequelize.transaction();

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

    const options = {
      resource_type: 'image',
      public_id: `devices/device_${id}/${uuidv4()}`,
    };

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
    const saveImgURL = async result => {
      const mainImgUrl = result.secure_url;
      device.mainImg = mainImgUrl;
      await device.save();
    };

    if (mainImg) {
      // Виклик функції для видалення старого mainImg
      await deleteImage(oldMainImg);

      // Зберігаємо новий mainImg
      try {
        await saveImage(saveImgURL, mainImg.data, options);
      } catch (error) {
        console.error(
          'Помилка при збереженні головного зображення: ',
          error.message,
        );
        return next(
          ApiError.internal(
            'Сталась помилка під час збереження головного зображення',
          ),
        );
      }
    }
    // знаходимо нові зображення
    if (images) {
      const imageFiles = Object.keys(images)
        .filter(key => key.startsWith('images['))
        .map(key => images[key]);
      // зберігаємо другорядні фото
      const saveSideImgURL = async result => {
        const imageUrl = result.secure_url;
        await DeviceImages.create({ fileName: imageUrl, deviceId: device.id });
      };
      // Зберігаємо додаткові фотографії та пов'язуємо їх з девайсом
      if (imageFiles?.length) {
        for (const image of imageFiles) {
          const options = {
            resource_type: 'image',
            public_id: `devices/device_${device.id}/${uuidv4()}`,
          };
          try {
            await saveImage(saveSideImgURL, image.data, options);
          } catch (error) {
            console.error(
              'Помилка при збереженні додаткового зображення: ',
              error.message,
            );
            return next(
              ApiError.internal(
                'Сталась помилка під час збереження додаткового зображення',
              ),
            );
          }
        }
      }
      // Видалення існуючих фотографій за ідентифікаторами
      if (deviceImagesNames && oldDeviceImages) {
        const newNames = JSON.parse(deviceImagesNames);
        const oldNames = JSON.parse(oldDeviceImages);
        if (newNames) {
          await Promise.all(
            oldNames.map(async name => {
              const includesFile = newNames.includes(name);
              if (!includesFile) {
                await deleteImage(name);
                await DeviceImages.destroy({ where: { fileName: name } });
              }
            }),
          );
        }
      }
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
    return res.json({ message: 'Девайс змінено', device });
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
