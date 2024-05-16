const saveCloudinaryImage = async (saveAvatarURL, fileData, options) => {
  try {
    // Опції для обробки зображення (розмір, формат, фон тощо)
    const transformationOptions = {
      width: 800,
      height: 800,
      crop: 'fit',
      quality: 'auto',
      fetch_format: 'auto',
      background: 'white',
    };

    // Створюємо Readable Stream з буфера даних
    const readableStream = Readable.from([fileData]);

    // Створюємо потік завантаження до Cloudinary з опціями та обробником подій
    const uploadStream = cloudinary.uploader.upload_stream(
      { ...transformationOptions },
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
