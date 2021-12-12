var express = require('express');
var router = express.Router();
const Usuario = require('../service/users');
const key = require('../config/keys');
const jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
  res.status(200).send('Bienvenido a Sitio Genérico de Compra de Hardware Online!');
});

router.post('/login', async (req, res) => {
  let credenciales = req.body;

  if(credenciales.login && credenciales.clave){
    Usuario.login(credenciales)
    .then(result => {
      // Guardo en el payload los resultados que me devuelve la base de datos, solo me interesa
      // el nombre completo, el id y el rol que tiene el usuario
      const payload = {
        id: result.id,
        nombre_completo: result.nombre_completo,
        admin: result.admin
      };

      const token = jwt.sign(payload, key.key, {
        expiresIn: '7d' // para testing
      });


      res.status(200).header("auth-token", token).json({
        message: 'Bienvenido, ' + result.nombre_completo,
        token: token
      });

    })
    .catch(err => {
      res.json(err);
    });
  } else {
    res.status(400).send({
      message: 'Faltan ingresar datos!'
    });
  }

  
});

module.exports = router;