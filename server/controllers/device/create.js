const { Device, DeviceInfo, DeviceImages } = require('../../models/models');
const uuid = require('uuid');
const path = require('path');

const create = async (req, res, next) => {
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
};
module.exports = create;
