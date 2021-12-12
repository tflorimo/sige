const key = require('../config/keys');
const jwt = require('jsonwebtoken');

// valida que el usuario esté logueado
function checkAuth(req, res, next) {
	let token = req.headers.authorization;
	
	if (!token) return res.status(401).send('Acceso denegado.');
	token = token.replace('Bearer ', '');
	try {	
		const decoded = jwt.verify(token, key.key);
		req.user = decoded;
		next();
	} catch (ex) {
		res.status(400).send('Credenciales inválidas.');
	}
}

function checkAdmin(req, res, next) {
	// if(req.user.admin == 1){
	// 	return true;
	// } else {
	// 	return false;
	// }
	console.log(req);
	if(req.user.admin == 1){
		next();
	} else {
		res.status(401).send('Acceso denegado.');
	}
}

async function user(req, res, next) {
	if(req.user.admin == 0){
		next();
	} else {
		res.status(401).send('Acceso denegado.');
	}
}

module.exports = {
	checkAuth,
	checkAdmin,
	user
}