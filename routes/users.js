var express = require('express');
var router = express.Router();
const Usuario = require('../service/users');

// Lista los usuarios que vienen de la base de datos
router.get('/', (req, res) => {
    data.getUsers().then(usuarios => {
        res.json(usuarios)
    }).catch(err => {
        res.json({
            error: err
        })
    })
});

// Modifica un usuario segun el id que envía en parámetros
router.patch('/:id', (req, res) => {
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
router.post('/', function(req, res, next) {
  if(Object.keys(req.body).length < 7){ // Siempre espero 7 campos
    res.status(400).send("Faltan campos para crear el usuario")
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