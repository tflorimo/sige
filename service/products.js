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

const actualizarProducto = (id, params) => {
    return new Promise((resolve, reject) => {
        
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

const comprarProducto = (idproducto, cantidad, metodoPago) => {
    return new Promise((resolve, reject) => {
        productModel.getProductoById(idproducto)
        .then(producto => {
            if(producto) {
                productModel.comprarProducto(idproducto, cantidad, metodoPago)
                .then(producto => {
                    resolve(producto);
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

const eliminarProducto = (idproducto) => {
    return new Promise((resolve, reject) => {
        productModel.getProductoById(idproducto)
        .then(producto => {
            if(producto) {
                productModel.deleteProducto(idproducto)
                .then(() => {
                    resolve("Producto eliminado exitosamente.")
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
    buscarProducto,
    eliminarProducto,
    cargarProducto,
    actualizarProducto,
    comprarProducto
}