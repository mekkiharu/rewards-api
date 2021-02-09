const resHeaders = (req, res, next) => {
	const allowedOrigin = process.env.CLIENT_ORIGIN || '*';

  res.setHeader(
		'Access-Control-Allow-Origin', 
		allowedOrigin
	);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
		'Access-Control-Allow-Headers', 
		'Content-Type, Authorization'
	);
  next();
};

module.exports = resHeaders;