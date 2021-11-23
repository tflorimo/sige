var express = require('express');
var router = express.Router();
const data = require('../data/users')

/* El inicio, retorna una lista de productos tras consultar con la base de datos */
router.get('/', function(req, res, next) {
  res.send('lista de precios')
  res.status(200);
});

router.post('/login/', async (req, res) => {
  let login = req.body.login;
  let clave = req.body.clave;
  
  data.findUserByLogin(login).then(user => {
    if (user.clave === clave) {
      res.status(200);
      res.send(user);
    } else {
      res.status(401);
      res.send('Usuario o clave incorrectos!');
    }
  }).catch(err => {
    res.status(404);
    res.send('Usuario o clave incorrectos!');
  })

});

module.exports = router;