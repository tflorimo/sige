const conn = require('./connection')

// Lista a todos los productos y su categoria, si no tiene stock, lo excluye en la query
const getProductos = () => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM productos WHERE stock_disponible > 0", function(err, rows, fields) {
            if (err) throw err;
            if(rows.length > 0) {
                resolve(rows);
            } else {
                reject("No se encontraron productos");
            }
        });
    });
}

// Lista todos los productos con la categoria, de acuerdo a la categoría enviada por parámetros	
const getProductosByCategoria = (categoria) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT p.idproducto, p.descrip AS producto, p.precio, pc.descrip AS categoria FROM productos AS p LEFT JOIN productos_categorias AS pc ON p.idcategoria = pc.idcategoria WHERE p.idcategoria = " + categoria + " ORDER BY p.idcategoria"
        conn.query(sql, function(err, rows, fields) {
            if (err) throw err;
            if(rows.length > 0) {
                resolve(rows);
            } else {
                reject("No se encontraron productos para esa categoria");
            }
        });
    });
}

// Busca un producto en la base de datos por su ID
const getProductoById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM productos WHERE idproducto = '" + id + "'", function(err, rows, fields) {
            if (err) throw err;
            if(rows.length > 0) {
                if(rows[0].stock_disponible == 0){
                    reject("No hay stock del producto " + rows[0].descrip);
                } else {
                    resolve(rows);
                }
            } else {
                reject("No se encontraron productos con ese ID");
            }
        });
    });
}

// Agrega un producto en la base de datos
const addProducto = (datos) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO productos SET ?", datos, function(err, rows, fields) {
            if (err) reject(err);
            resolve("Producto agregado con éxito!");
        });
    });
}

// Modifica un producto en la base de datos por su ID y los datos enviados por parámetros
const updateProducto = (id, datos) => {
    return new Promise((resolve, reject) => {
        if(datos.precio == 0){
            reject("El precio no puede ser 0");
        } else if(datos.idcategoria == 0){
            reject("Debe ingresar un ID de categoría válido");
        } else if(datos.descrip == " "){
            reject("Debe ingresar una descripción de producto.");
        } else {
            conn.query("UPDATE productos SET ? WHERE idproducto = '" + id + "'", datos, function(err, rows, fields) {
                if (err) throw err;
                if(rows.affectedRows > 0) {
                    resolve("Producto modificado con éxito!");
                } else {
                    reject("No se encontró el producto con ese ID");
                }
            });
        }
    });
}

// Resta {parametro} stock del producto {id}
const buyProduct = (id, stock) => {
    return new Promise((resolve, reject) => {
        conn.query("UPDATE productos SET stock_disponible = stock_disponible - " + stock + " WHERE idproducto = '" + id + "'", function(err, rows, fields) {
            if (err) reject(err);
            resolve("Producto comprado con éxito!");
        });
    });

}

const addCategoria = (categoria) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO productos_categorias SET descrip = '" + categoria + "'", function(err, rows, fields) {
            if (err) reject(err);
            resolve("Categoría agregada con éxito!");
        });
    });
}

const getCategorias = () => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM productos_categorias", function(err, rows, fields) {
            if (err) reject(err);
            if(rows.length > 0) {
                resolve(rows);
            } else {
                reject("No hay categorías!")
            }
        });
    });
}

module.exports = {
    getProductos,
    getProductoById,
    updateProducto,
    addProducto,
    addCategoria,
    getCategorias,
    buyProduct,
    getProductosByCategoria
}