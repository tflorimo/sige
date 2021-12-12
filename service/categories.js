const Categoria = require('../data/categories');
const Producto = require('../data/products');
const categoryModel = new Categoria();
const productModel = new Producto();

const obtenerCategoria = (idcategoria) => {
    return new Promise((resolve, reject) => {
        categoryModel.getCategoriaById(idcategoria)
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
        categoryModel.getCategorias()
        .then(categorias => {
            resolve(categorias);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const agregarCategoria = (params) => {

    return new Promise((resolve, reject) => {
        categoryModel.addCategoria(params).then(() => {
            resolve("Categoria agregada exitosamente.")
        }).catch(err => {
            reject(err);
        })
    })
}

const actualizarCategoria = (id, params) => {
    return new Promise((resolve, reject) => {
        categoryModel.getCategoriaById(id)
        .then(categoria => {
            if(categoria) {
                categoryModel.updateCategoria(id, params)
                .then(categoria => {
                    resolve("Categoria actualizada exitosamente.")
                })
                .catch(err => {
                    reject(err);
                })
            } else {
                reject("No existe una categoria con esa ID.");
            }
        })
        .catch(err => {
            reject(err);
        })
    })
}

const listarProductosPorCategoria = (idcategoria) => {
    // valida que la categoría exista antes de procesar toda la información
    return new Promise((resolve, reject) => {
        categoryModel.checkCategoriaById(idcategoria)
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

const eliminarCategoria = (idcategoria) => {

    return new Promise((resolve, reject) => {
        categoryModel.checkCategoriaById(idcategoria)
        .then(existe => {
            categoryModel.borrarCategoria(idcategoria)
            .then(() => {
                resolve("Categoria eliminada exitosamente.")
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

module.exports = {
    obtenerCategoria,
    listarProductosPorCategoria,
    eliminarCategoria,
    listarCategorias,
    agregarCategoria,
    actualizarCategoria
}