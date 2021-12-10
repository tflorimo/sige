var express = require('express');
var router = express.Router();
const Usuario = require('../service/users');
const { authAdmin } = require('../middleware/auth');

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
router.patch('/modificar/:id', (req, res) => {
    let id = req.params.id
    let datos = req.body

    data.findUserById(id).then(usuarioModificado => {   
      if(usuarioModificado.length > 0){
        let usuario = {
          login: datos.login || usuarioModificado[0].login,
          clave: datos.clave || usuarioModificado[0].clave,
          telefono: datos.telefono || usuarioModificado[0].telefono,
          nombre_completo: datos.nombre_completo || usuarioModificado[0].nombre_completo,
          email: datos.email || usuarioModificado[0].email,
          genero: datos.genero || usuarioModificado[0].genero,
          admin: datos.admin || usuarioModificado[0].admin
        } 
        data.updateUser(id, usuario).then(() => {
          res.status(200).send("Usuario modificado exitosamente")
        }).catch(err => {
          res.status(500).send("Error actualizando usuario: " + err)
        })
      }}).catch(err => {
        res.status(500).send("Error buscando usuario: " + err)
      })
});

// Valida que esten todos los campos y agrega al usuario mientras que no se repita el login
router.post('/agregar/', function(req, res, next) {
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