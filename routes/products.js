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

// Compra un producto (restar stock)
router.post('/comprar/:idproducto/:stock', (req, res) => {
    data.getProductoById(req.params.idproducto).then(producto => {
        if(producto[0].stock_disponible >= req.params.stock){
            data.buyProduct(req.params.idproducto, req.params.stock).then(producto => {
                res.status(200).json(producto)
            }).catch(err => {
                res.status(500).send("Error: " + err)
            })
        } else {
            res.status(402).send("No hay stock suficiente del producto")
        }
    }).catch(err => {
        res.status(404).send("Error: " + err)
    })
});

// Valida la existencia de todos los campos que vienen en el body y crea un nuevo producto
router.post('/', (req, res) => {
    let datos = req.body
    if(Object.keys(req.body).length < 4){
        res.status(400).send("Faltan datos")
    } else {
        if(datos.descrip && datos.precio && datos.idcategoria && datos.stock_disponible){
            data.addProducto(datos).then(() => {
                res.status(200).send("Producto creado exitosamente")
            }).catch(err => {
                res.status(500).send("Error creando producto: " + err)
            })
        } else {
            res.status(400).send("Error: Faltan datos")
        }
    }
});

// Agrega una categoria
router.post('/categoria/agregar/', (req, res) => {
    let datos = req.body
    if(Object.keys(req.body).length < 1){
        res.status(400).send("Faltan datos")
    } else {
        if(datos.descrip){
            data.addCategoria(datos.descrip).then(() => {
                res.status(200).send("Categoria creada exitosamente")
            }).catch(err => {
                res.status(500).send("Error creando categoria: " + err)
            })
        } else {
            res.status(400).send("Error: Faltan datos")
        }
    }
});

// PATCHES

// Modifica un producto segun su ID y el contenido del body
router.patch('/modificar/:id', (req, res) => {
    let id = req.params.id
    let datos = req.body

    data.getProductoById(id).then(productoModificado => {   
      if(productoModificado.length > 0){
        let producto = {
          descrip: datos.descrip || productoModificado[0].descrip,
          precio: datos.precio || productoModificado[0].precio,
          idcategoria: datos.idcategoria || productoModificado[0].idcategoria,
          stock_disponible: datos.stock_disponible || productoModificado[0].stock_disponible
        } 
        data.updateProducto(id, producto).then(() => {
            res.status(200).send("Producto modificado exitosamente")
        }).catch(err => {
            res.status(500).send("Error actualizando producto: " + err)
        })
      }}).catch(err => {
        res.status(500).send("Error buscando producto: " + err)
      })
});

module.exports = router;
