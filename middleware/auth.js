
const jwt =require('jsonwebtoken') ;
function auth(req, res, next) {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		if (!jwt.verify(token, process.env.SECRET)) {
			jwt.verify(token, process.env.SECRET_ADMIN);
		}
		next();
	} catch (error) {
		res.status(401).send({ error: error.message });
	}
}

function authAdmin(req, res, next) {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		jwt.verify(token, process.env.SECRET_ADMIN);
		next();
	} catch (error) {
		res.status(401).send({ error: error.message });
	}
}

module.exports = { auth, authAdmin };