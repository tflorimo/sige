const conn = require('./connection')

// Lista a todos los productos y su categoria, si no tiene stock, lo excluye en la query
const getProductos = () => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM productos WHERE stock_disponible > 0", function(err, rows, fields) {
            if (err) throw err;
            if(rows.length > 0) {
                resolve(rows);
            } else {
                reject(false);
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
                reject(false);
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
                reject(false);
            }
        });
    });
}

// Agrega un producto en la base de datos
const addProducto = () => {
    
}

module.exports = {
    getProductos,
    getProductoById,
    getProductosByCategoria
}