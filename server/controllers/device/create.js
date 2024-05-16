const { Device, DeviceInfo, DeviceImages } = require('../../models/models');
const { v4: uuidv4 } = require('uuid');
const { saveImage } = require('../../helpers');

const create = async (req, res, next) => {
  // Створюємо новий девайс

  let { name, price, brandId, typeId, info, rating } = req.body;
  const { mainImg } = req.files;
  const images = req.files;

  // створюємо девайс
  const device = await Device.create({
    name,
    price,
    rating,
    brandId,
    typeId,
  });

  // зберігаємо основне фото
  const saveImgURL = async result => {
    const mainImgUrl = result.secure_url;
    device.mainImg = mainImgUrl;
    await device.save();
  };
  const options = {
    resource_type: 'image',
    public_id: `devices/device_${device.id}/${uuidv4()}`,
  };

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

  // Зберігаємо додаткові фотографії та пов'язуємо їх з девайсом
  const imageFiles = Object.keys(images)
    .filter(key => key.startsWith('images['))
    .map(key => images[key]);

  // зберігаємо другорядні фото
  const saveSideImgURL = async result => {
    const imageUrl = result.secure_url;
    await DeviceImages.create({ fileName: imageUrl, deviceId: device.id });
  };

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
};
module.exports = create;
