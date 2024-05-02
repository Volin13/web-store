const { CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dwgpcl0nu',
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const deleteImageFromCloudinary = async url => {
  const pathArr = url.split('/');
  const fileName = pathArr.at(-1); // Отримання ідентифікатора зображення з URL
  const imgId = fileName.split('.')[0]; // Вилучення чистого ідентифікатора без розширення
  const userId = pathArr.at(-2); // Отримання ідентифікатора користувача
  const fullImgId = `${userId}/${imgId}`; // Створення повного ідентифікатора для видалення

  try {
    const result = await cloudinary.uploader.destroy(fullImgId, async error => {
      if (error) {
        console.log(error.message);
      }
    });
    console.log(result);
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = deleteImageFromCloudinary;
