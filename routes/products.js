var express = require('express');
var router = express.Router();
const data = require('../data/products')

// Lista todos los productos QUE TENGAN STOCK y su categoria
router.get('/', (req, res) => {
    data.getProductos().then(productos => {
        res.status(200).json(productos)
    }).catch(err => {
        res.status(404).send("No se encontraron productos")
    })
});

// Lista todos los productos y su categoria
router.get('/categoria/:idcategoria', (req, res) => {
    data.getProductosByCategoria(req.params.idcategoria).then(productos => {
        res.status(200).json(productos)
    }).catch(err => {
        res.status(404).send("No se encontraron productos en la categoria")
    })
});

// Busca un producto segun su ID
router.get('/:idproducto', (req, res) => {
    data.getProductoById(req.params.idproducto).then(producto => {
        res.status(200).json(producto)
    }).catch(err => {
        res.status(404).send(err)
    })
});

module.exports = router;
