const { v4: uuidv4 } = require('uuid');
const { Readable } = require('stream');
const { CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dwgpcl0nu',
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const saveCloudinaryImage = async (saveAvatarURL, userId, fileData) => {
  const options = {
    resource_type: 'image',
    public_id: `${userId}/${uuidv4()}`,
  };

  try {
    // Створюємо Readable Stream з буфера даних
    const readableStream = Readable.from([fileData]);

    // Створюємо потік завантаження до Cloudinary з опціями та обробником подій
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      async (error, result) => {
        if (error) {
          console.log(error.message);
        } else {
          try {
            // Обробляємо результат завантаження
            await saveAvatarURL(result);
          } catch (error) {
            console.log(error.message);
          }
        }
      },
    );

    // Передаємо потік даних файлу у потік завантаження до Cloudinary
    readableStream.pipe(uploadStream);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = saveCloudinaryImage;
