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
        console.log(categoria);
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
                    resolve(rows);
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

    // resta del stock disponible la cantidad enviada por parámetro, si la cantidad es mayor al stock disponible, no se puede restar
    comprarProducto = (idproducto, cantidad, metodoPago) => {
        return new Promise((resolve, reject) => {
            // obtiene el metodo de pago de la compra y lo pasa para la lógica
            this.getMetodoPago(metodoPago)
            .then(metodo => {
                let metodoDePago = metodo[0];
                conn.query("SELECT descrip, precio, stock_disponible FROM productos WHERE idproducto = '" + idproducto + "'", function(err, rows, fields) {
                    if (err) reject(err);
                    if(rows[0].stock_disponible >= cantidad) {
                        let mensaje = "Compra de " + cantidad + " " + rows[0].descrip + " realizada con éxito!\n";
                        mensaje += "Precio original: " + rows[0].precio + "\n";

                        if(metodoDePago.descuento > 0){
                            mensaje += "Descuento aplicado: " + metodoDePago.descuento + "% por abonar con metodo de pago " + metodoDePago.descrip + "\n";
                            rows[0].precio = rows[0].precio - (rows[0].precio * (metodoDePago.descuento / 100));
                        }

                        if(cantidad < 10){
                            mensaje += "Recuerde que si compra más de 10 unidades de un producto, se le aplicará un descuento del 10% al total de su compra.\n";
                        } else {
                            mensaje += "Se aplica un descuento del 10% por compra mayorista (10 unidades o más).\n";
                            rows[0].precio = rows[0].precio - (rows[0].precio * (10 / 100));
                        }

                        mensaje += "Precio final por unidad: " + rows[0].precio + "\n";
                        mensaje += "Valor total a abonar: " + cantidad * rows[0].precio + "\n";
                        mensaje += "Gracias por su compra!";


                        conn.query("UPDATE productos SET stock_disponible = stock_disponible - " + cantidad + " WHERE idproducto = '" + idproducto + "'", function(err, rows, fields) {
                            if (err) reject(err);
                            resolve(mensaje);
                        });
                    } else {
                        reject("No hay suficiente stock disponible.");
                    }
                });
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    // elimina el producto de la base de datos, pero no deja si tiene stock disponible
    deleteProducto = (id) => {
        return new Promise((resolve, reject) => {
            conn.query("SELECT stock_disponible FROM productos WHERE idproducto = '" + id + "'", function(err, rows, fields) {
                if (err) reject(err);
                if(rows[0].stock_disponible == 0){
                    conn.query("DELETE FROM productos WHERE idproducto = '" + id + "'", function(err, rows, fields) {
                        if (err) reject(err);
                        resolve("Producto eliminado con éxito!");
                    });
                } else {
                    reject("No se puede eliminar el producto, tiene stock disponible.");
                }
            });
        });
    }

    getMetodoPago = (metodoPago) => {
        
        return new Promise((resolve, reject) => {
            conn.query("SELECT * FROM pago_metodos WHERE idmetodo = '" + metodoPago + "'", function(err, rows, fields) {
                if (err) reject(err);
                if(rows.length > 0) {
                    resolve(rows);
                } else {
                    reject("No se encontró el metodo de pago!");
                }
            });
        });
    }

}


module.exports = Producto