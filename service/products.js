// Capa de servicios para modelo de negocio de Productos

const Producto = require('../data/products');
const productModel = new Producto();

const listarProductos = () => {
    return new Promise((resolve, reject) => {
        productModel.getProductos()
        .then(productos => {
            resolve(productos);
        })
        .catch(err => {
            reject(err);
        });    
    })
}

const listarProductosPorCategoria = (idcategoria) => {
    // valida que la categoría exista antes de procesar toda la información
    return new Promise((resolve, reject) => {
        productModel.checkCategoriaById(idcategoria)
        .then(existe => {
            productModel.getProductosByCategoria(idcategoria)
            .then(productos => {
                resolve(productos);
            })
            .catch(err => {
                reject(err);
            })   
        })
        .catch(err => {
            reject(err);
        })
    })
}

const obtenerCategoria = (idcategoria) => {
    return new Promise((resolve, reject) => {
        productModel.getCategoriaById(idcategoria)
        .then(categoria => {
            resolve(categoria);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const listarCategorias = () => {
    return new Promise((resolve, reject) => {
        productModel.getCategorias()
        .then(categorias => {
            resolve(categorias);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const buscarProducto = (idproducto) => {
    return new Promise((resolve, reject) => {
        productModel.getProductoById(idproducto).then(producto => {
            resolve(producto);
        }).catch(err => {
            reject(err);
        })
    })
}

const crearProducto = () => {
    
}

module.exports = {
    listarProductos,
    listarCategorias,
    obtenerCategoria,
    buscarProducto,
    listarProductosPorCategoria
}