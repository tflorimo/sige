var express = require('express');
var router = express.Router();
const Producto = require('../service/products')
const {checkAuth, checkUser, checkAdmin} = require('../middleware/auth')

/**
 * A los endpoints que sean de tipo GET acceden todos los usuarios, al resto de endpoints solo los usuarios autenticados (en algunos depende el tipo de autenticación)
 */

// Lista todos los productos QUE TENGAN STOCK y su categoria
router.get('/', (req, res) => {

    Producto.listarProductos()
    .then(productos => {
        res.status(200).json(productos)
    })
    .catch(err => {
        res.status(500).send("No se encontraron productos")
    })

});

// Busca un producto segun su ID
router.get('/:idproducto', (req, res) => {
    let idproducto = req.params.idproducto;
    Producto.buscarProducto(idproducto).then(producto => {
        res.status(200).json(producto);
    }).catch(err => {
        res.status(204).send(err);
    })
});

// POSTS
// Valida la existencia de todos los campos que vienen en el body y crea un nuevo producto
router.post('/', checkAuth, checkAdmin,(req, res) => {
    let datos = req.body
    if(Object.keys(req.body).length < 4){
        res.status(400).send("Debe ingresar todos los campos para cargar un producto.")
    } else {
        let producto = {
            descrip: datos.descrip,
            idcategoria: datos.idcategoria,
            precio: datos.precio, 
            stock_disponible: datos.stock_disponible
        }
        // la restriccion de carga de productos indica que no pueden repetirse para la misma descripcion y categoría
        Producto.cargarProducto(producto).then(() => {
            res.status(200).send("Producto cargado exitosamente.")
        }).catch(err => {
            res.status(500).send("Error cargando producto: " + err);
        })
    }
});

// Compra un producto (resta la cantidad enviada en el request). A esta ruta pueden acceder usuarios LOGUEADOS, y ADMINISTRADORES
router.post('/comprar/:idproducto', checkAuth, checkUser, (req, res) => {
    let idProducto = req.params.idproducto;
    let cantidad = req.body.cantidad;

    if(cantidad == null || cantidad == undefined){
        res.status(400).send("Debe enviar la cantidad a comprar")
    } else if (cantidad <= 0){
        res.status(400).send("La cantidad debe ser mayor a 0")
    } else {

        Producto.comprarProducto(idProducto, cantidad)
        .then(() => {
            res.status(200).send("Producto comprado exitosamente.")
        })
        .catch(err => {
            res.status(500).send("Error comprando producto: " + err);
        });

    }
});

// PATCHES
// Modifica un producto segun su ID y el contenido del body
router.patch('/:id', checkAuth, checkAdmin, (req, res) => {
    let id = req.params.id
    let datos = req.body

    let product = {
        ...datos.descrip ? {descrip: datos.descrip} : {},
        ...datos.idcategoria ? {idcategoria: datos.idcategoria} : {},
        ...datos.precio ? {precio: datos.precio} : {},
        ...datos.stock_disponible ? {stock_disponible: datos.stock_disponible} : {}
    }

    Producto.actualizarProducto(id, product).then(() => {
        res.status(200).send("Producto modificado exitosamente.")
    }).catch(err => {
        res.status(500).send("Error modificando producto: " + err);
    })
});

module.exports = router;
