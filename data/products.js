const conn = require('./connection')

class Producto {
    // Lista a todos los productos y su categoria, si no tiene stock, lo excluye en la query
    getProductos = () => {
        return new Promise((resolve, reject) => {
            conn.query("SELECT * FROM productos WHERE stock_disponible > 0", function(err, rows, fields) {
                if (err){
                    reject(err);
                } else if(rows.length > 0) {
                    resolve(rows);
                } else {
                    reject("No se encontraron productos");
                }
            });
        });
    }

    // Lista todos los productos con la categoria, de acuerdo a la categoría enviada por parámetros	
    getProductosByCategoria = (categoria) => {
        return new Promise((resolve, reject) => {
            let sql = "SELECT p.idproducto, p.descrip AS producto, p.precio, pc.descrip AS categoria FROM productos AS p LEFT JOIN productos_categorias AS pc ON p.idcategoria = pc.idcategoria WHERE p.idcategoria = " + categoria + " ORDER BY p.idcategoria"
            conn.query(sql, function(err, rows, fields) {
                if (err){
                    reject(err);
                } else if(rows.length > 0) {
                    resolve(rows);
                } else {
                    reject("No se encontraron productos para esa categoria");
                }
            });
        });
    }

    // Busca un producto en la base de datos por su ID
    getProductoById = (id) => {
        return new Promise((resolve, reject) => {
            conn.query("SELECT * FROM productos WHERE idproducto = '" + id + "'", function(err, rows, fields) {
                if (err) {
                    reject(err);
                } else if(rows.length > 0) {
                    if(rows[0].stock_disponible == 0){ // esto sirve para que no se pueda modificar el producto si no tiene stock (no tendría sentido)
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
    addProducto = (datos) => {
        return new Promise((resolve, reject) => {

            let sql = "SELECT idcategoria, descrip FROM productos WHERE descrip LIKE '" + datos.descrip + "' AND idcategoria = " + datos.idcategoria;

            conn.query(sql, function(err, rows, fields) {
                if (err) {
                    reject(err);
                } else if(rows.length > 0) {
                    reject("Ya existe un producto con ese nombre en esa categoria");
                } else {
                    conn.query("INSERT INTO productos SET ?", datos, function(err, rows, fields) {
                        if (err) reject(err);
                        resolve("Producto agregado con éxito!");
                    });
                }
            });
        })
    }

    // Modifica un producto en la base de datos por su ID y los datos enviados por parámetros
    updateProducto = (id, datos) => {
        return new Promise((resolve, reject) => {
            if(datos.precio == 0){
                reject("El precio no puede ser 0");
            } else if(datos.idcategoria == 0){
                reject("Debe ingresar un ID de categoría válido");
            } else if(datos.descrip == " "){
                reject("Debe ingresar una descripción de producto.");
            } else {
                conn.query("UPDATE productos SET ? WHERE idproducto = '" + id + "'", datos, function(err, rows, fields) {
                    if (err) {
                        reject(err);
                    } else if(rows.affectedRows > 0) {
                        resolve("Producto modificado con éxito!");
                    } else {
                        reject("No se encontró el producto con ese ID");
                    }
                });
            }
        });
    }

    updateCategoria = (id, datos) => {
        return new Promise((resolve, reject) => {
            if(datos.descrip == " "){
                reject("Debe ingresar una descripción de categoría.");
            } else {
                conn.query("UPDATE productos_categorias SET ? WHERE idcategoria = '" + id + "'", datos, function(err, rows, fields) {
                    if (err) {
                        reject(err);
                    } else if(rows.affectedRows > 0) {
                        resolve("Categoría modificada con éxito!");
                    } else {
                        reject("No se encontró la categoría con ese ID");
                    }
                });
            }
        });
    }

    // Resta {parametro} stock del producto {id}
    buyProduct = (id, stock) => {
        return new Promise((resolve, reject) => {
            conn.query("UPDATE productos SET stock_disponible = stock_disponible - " + stock + " WHERE idproducto = '" + id + "'", function(err, rows, fields) {
                if (err) reject(err);
                resolve("Producto comprado con éxito!");
            });
        });

    }

    //
    addCategoria = (datos) => {
        return new Promise((resolve, reject) => {

            let sql = "SELECT idcategoria, descrip FROM productos_categorias WHERE descrip LIKE '" + datos.descrip + "'";

            conn.query(sql, function(err, rows, fields) {
                if(err){
                    reject(err);
                } else if (rows.length > 0) {
                    reject("Ya existe una categoría con ese nombre");
                } else {
                    conn.query("INSERT INTO productos_categorias SET descrip = '" + datos.descrip + "'", function(err, rows, fields) {
                        if (err) reject(err);
                        resolve("Categoría agregada con éxito!");
                    });
                }
            });
        });
    }

    getCategorias = () => {
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

    // funcion booleana que valida la existencia de una categoría en la base de datos, NO RETORNA LA CATEGORIA EN SÍ
    checkCategoriaById = (idcategoria) => {
        return new Promise((resolve, reject) => {
            let sql = "SELECT idcategoria FROM productos_categorias WHERE idcategoria = '" + idcategoria + "'";
            conn.query(sql, function(err, rows){
                if(err) {
                    reject(err);
                } else if(rows.length > 0) {
                    resolve(true); 
                } else {
                    reject("No se encontró una categoría con ese ID.");
                }
            })
        })
    }

    // retorna la descripcion de una categoria y su id
    getCategoriaById = (idcategoria) => {
        return new Promise((resolve, reject) => {

            let sql = "SELECT idcategoria, descrip FROM productos_categorias WHERE idcategoria = '" + idcategoria + "'";

            conn.query(sql, function(err, rows){
                if(err){
                    reject(err);
                } else if(rows.length > 0){
                    resolve(rows);
                } else {
                    reject("No se encontró una categoria con ese ID.")
                }
            })

        })
    }

    // resta del stock disponible la cantidad enviada por parámetro, si la cantidad es mayor al stock disponible, no se puede restar
    comprarProducto = (idproducto, cantidad) => {
        return new Promise((resolve, reject) => {
            conn.query("SELECT stock_disponible FROM productos WHERE idproducto = '" + idproducto + "'", function(err, rows, fields) {
                if (err) reject(err);
                if(rows[0].stock_disponible >= cantidad) {
                    conn.query("UPDATE productos SET stock_disponible = stock_disponible - " + cantidad + " WHERE idproducto = '" + idproducto + "'", function(err, rows, fields) {
                        if (err) reject(err);
                        resolve("Producto comprado con éxito!");
                    });
                } else {
                    reject("No hay suficiente stock disponible.");
                }
            });
        });
    }

}


module.exports = Producto