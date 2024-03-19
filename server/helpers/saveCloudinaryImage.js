const { v4: uuidv4 } = require('uuid');

const { CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dwgpcl0nu',
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const saveCloudinaryImage = async (buffer, saveAvatarURL, userId) => {
  const options = {
    resource_type: 'image',
    public_id: `${userId}/${uuidv4()}`,
  };
  try {
    const result = await cloudinary.uploader
      .upload_stream(options, async (error, result) => {
        if (error) {
          console.log(error.message);
        } else {
          try {
            await saveAvatarURL(result);
          } catch (error) {
            console.log(error.message);
          }
        }
      })
      .end(buffer);
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = saveCloudinaryImage;
