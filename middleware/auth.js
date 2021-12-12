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

async function checkAdmin(req, res, next) {
	if(req.user.admin == 1){
		next();
	} else {
		res.status(401).send('Acceso denegado.');
	}
}

async function checkUser(req, res, next) {
	if(req.user.admin == 0 || req.user.admin == 1){ // esto es para que valide que llega un token y valida si es usuario logueado en si
		next();
	} else {
		res.status(401).send('Para continuar, debe iniciar sesión.');
	}
}

module.exports = {
	checkAuth,
	checkAdmin,
	checkUser
}