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

const cargarProducto = (params) => {

    return new Promise((resolve, reject) => {
        productModel.addProducto(params).then(() => {
            resolve("Producto agregado exitosamente.")
        }).catch(err => {
            reject(err);
        })
    })

}

const agregarCategoria = (params) => {

    return new Promise((resolve, reject) => {
        productModel.addCategoria(params).then(() => {
            resolve("Categoria agregada exitosamente.")
        }).catch(err => {
            reject(err);
        })
    })
}

const actualizarProducto = (id, params) => {
    return new Promise((resolve, reject) => {

        console.log(params);
        
        if(params.descrip && !validarDescripcion(params.descrip)) {
            reject("Se espera que la descripcion del producto sea de tipo String y que su longitud sea mayor a 2 caracteres.");
        }
        productModel.getProductoById(id)
        .then(producto => {
            if(producto) {
                productModel.updateProducto(id, params)
                .then(producto => {
                    resolve("Producto actualizado exitosamente.")
                })
                .catch(err => {
                    reject(err);
                })
            } else {
                reject("No existe un producto con esa ID.");
            }
        })
        .catch(err => {
            reject(err);
        })
    })
}

const actualizarCategoria = (id, params) => {
    return new Promise((resolve, reject) => {
        productModel.getCategoriaById(id)
        .then(categoria => {
            if(categoria) {
                productModel.updateCategoria(id, params)
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

const comprarProducto = (idproducto, cantidad) => {
    return new Promise((resolve, reject) => {
        productModel.getProductoById(idproducto)
        .then(producto => {
            if(producto) {
                productModel.comprarProducto(idproducto, cantidad)
                .then(producto => {
                    resolve("Producto comprado exitosamente.")
                })
                .catch(err => {
                    reject(err);
                })
            } else {
                reject("No existe un producto con esa ID.");
            }
        })
        .catch(err => {
            reject(err);
        })
    })
}

const validarDescripcion = (descrip) => {
    if(typeof descrip != "string" || descrip.length < 2) {
        return false;
    }
    return true;
}

module.exports = {
    listarProductos,
    listarCategorias,
    obtenerCategoria,
    buscarProducto,
    cargarProducto,
    agregarCategoria,
    actualizarProducto,
    actualizarCategoria,
    comprarProducto,
    listarProductosPorCategoria
}