var express = require('express');
var router = express.Router();
const Usuario = require('../service/users');
const {checkAuth, checkAdmin} = require('../middleware/auth');

// Solo los administradores pueden interactuar con esta ruta

// Lista los usuarios que vienen de la base de datos
router.get('/', checkAuth, checkAdmin, (req, res, next) => {

	Usuario.listarUsuarios()
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((err) => {
			res.status(500).json(err);
		})

});

// Busca a un usuario por su id.
router.get('/:id', checkAuth, checkAdmin, (req, res, next) => {
  
  let id = req.params.id;
  
  Usuario.buscarUsuario(id)
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((err) => {
    res.status(500).json(err);
  })

})

// Modifica un usuario segun el id que envía en parámetros
router.patch('/:id', checkAuth, checkAdmin, (req, res, next) => {
    let id = req.params.id;
    let user = {
		...req.body.login ? {login: req.body.login} : {},
		...req.body.clave ? {clave: req.body.clave} : {},
		...req.body.telefono ? {telefono: req.body.telefono} : {},
		...req.body.nombre_completo ? {nombre_completo: req.body.nombre_completo} : {},
		...req.body.email ? {email: req.body.email} : {},
		...req.body.genero ? {genero: req.body.genero} : {},
		...req.body.admin ? {admin: req.body.admin} : {}
    }

    Usuario.actualizarUsuario(id, user).then(() => {
		res.status(200).send("Usuario modificado exitosamente")
    }).catch(err => {
		res.status(500).send("Error actualizando usuario: " + err)
    })

});

// Valida que esten todos los campos y agrega al usuario mientras que no se repita el login
router.post('/', checkAuth, checkAdmin, (req, res, next) => {
	if(Object.keys(req.body).length < 7){ // Siempre espero 7 campos
		res.status(400).send("Faltan campos para crear el usuario")
	} else if (req.body.clave && req.body.clave.length < 4) {
		res.status(400).send("La clave debe tener al menos 4 caracteres")
	} else {

		let user = {
			login: req.body.login,
			clave: req.body.clave,
			telefono: req.body.telefono,
			nombre_completo: req.body.nombre_completo,
			email: req.body.email,
			genero: req.body.genero,
			admin: req.body.admin
		}  

		Usuario.registrarUsuario(user)
		.then(() => {
			res.status(200).send("Usuario creado exitosamente")
		}).catch(err => {
			res.status(500).send("Error creando usuario: " + err)
		})
	}

});

module.exports = router;