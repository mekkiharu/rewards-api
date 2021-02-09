// Libraries
const mongoose = require('mongoose');

const database = (app) => {
	return mongoose
		.connect(
			process.env.DATABASE_URL,
			{ 
				useNewUrlParser: true, 
				useUnifiedTopology: true,
				useFindAndModify: false
			}
		)
		.then(result => {
			app.listen(process.env.PORT || 8080);
		})
		.catch(err => {
			console.log(err);
		});
};

module.exports = database;