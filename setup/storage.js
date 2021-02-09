// Libraries
const multer = require('multer');
const mkdirp = require('mkdirp');

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
		const dest = 'assets';
		mkdirp(dest)
			.then(result => callback(null, dest))
			.catch(err => callback(err, dest))
  },
  filename: (req, file, callback) => {
    callback(null, `${new Date().toISOString()}-${file.originalname}`);
  }
});

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
	fileStorage,
	fileFilter
}