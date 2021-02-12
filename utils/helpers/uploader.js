// Libraries
var cloudinary = require('cloudinary').v2;

// set cloudinary configs
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadFile = (file, cb) => {
	cloudinary.uploader.upload_stream((err, image) => {
		if (err) {
			cb(null, err);
		}
		return cb(image.secure_url)
	})
	.end(file.buffer);
}

module.exports = {
	uploadFile
}