var express = require('express');
var router = express.Router();
const Producto = require('../service/products')

// Todo el mundo accede a esta ruta

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
        res.status(500).send(err);
    })
});

// Lista todas las categorias
router.get('/categoria/', (req,res) => {
    
    Producto.listarCategorias().then(categorias => {
        res.status(200).json(categorias);
    }).catch(err => {
        res.status(500).send(err);
    })

});

router.get('/categoria/:idcategoria', (req, res) => {

    let idcategoria = req.params.idcategoria;

    Producto.obtenerCategoria(idcategoria)
    .then(categoria => {
        res.status(200).json(categoria);
    })
    .catch(err => {
        res.status(500).send(err);
    })

})

// Lista todos los productos para una categoría
router.get('/categoria/listar/:idcategoria', (req, res) => {
    
    let idcategoria = req.params.idcategoria;
    Producto.listarProductosPorCategoria(idcategoria)
    .then(productos => {
        res.status(200).json(productos);
    })
    .catch(err => {
        res.status(500).send(err);
    })

});

// POSTS

// Valida la existencia de todos los campos que vienen en el body y crea un nuevo producto
router.post('/', (req, res) => {
    let datos = req.body
    if(Object.keys(req.body).length < 4){
        res.status(400).send("Faltan datos")
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

// Agrega una categoria
router.post('/categoria/', (req, res) => {
    let datos = req.body
    if(Object.keys(req.body).length < 1){
        res.status(400).send("Faltan datos")
    } else {
        let categoria = {descrip: datos.descrip}
        Producto.agregarCategoria(categoria).then(() => {
            res.status(200).send("Categoria cargada exitosamente.")
        }
        ).catch(err => {
            res.status(500).send("Error cargando categoria: " + err);
        })
    }
});

// Compra un producto (resta la cantidad enviada en el request)
router.post('/comprar/:idproducto', (req, res) => {
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
router.patch('/:id', (req, res) => {
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

// Actualiza una categoria
router.patch('/categoria/:id', (req, res) => {

    let idcategoria = req.params.id;

    let datos = req.body

    let categoria = {
        ...datos.descrip ? {descrip: datos.descrip} : {},
    }
    
    Producto.actualizarCategoria(idcategoria, categoria)
    .then(() => {
        res.status(200).send("Categoria modificada exitosamente.")
    })
    .catch(err => {
        res.status(500).send("Error modificando categoria: " + err);
    })

});

module.exports = router;
