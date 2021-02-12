// Libraries
const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

module.exports = {
	storage,
	fileFilter
}