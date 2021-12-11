var express = require('express');
var router = express.Router();
const Usuario = require('../service/users');
const key = require('../config/keys');
const jwt = require('jsonwebtoken');

/* El inicio, retorna una lista de productos tras consultar con la base de datos */
router.get('/', function(req, res, next) {
  res.send('lista de precios')
  res.status(200);
});

router.post('/login', async (req, res) => {
  let credenciales = req.body;

  if(credenciales.login && credenciales.clave){
    Usuario.login(credenciales)
    .then(result => {
      const payload = {
        check:true
      };
      const token = jwt.sign(payload, key.key, {
        expiresIn: '1440'
      });

      res.json({
        message: 'Login correcto',
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