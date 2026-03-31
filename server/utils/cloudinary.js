const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    stream.end(buffer);
  });

const destroyCloudinaryAsset = async (publicId) => {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId);
};

module.exports = {
  cloudinary,
  uploadBufferToCloudinary,
  destroyCloudinaryAsset,
};
