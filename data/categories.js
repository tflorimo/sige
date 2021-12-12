const conn = require('./connection')

class Categoria {

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

    borrarCategoria = (idcategoria) => {

        return new Promise((resolve, reject) => {
                
                let sql = "DELETE FROM productos_categorias WHERE idcategoria = '" + idcategoria + "'";
    
                conn.query(sql, function(err, rows){
                    if(err){
                        reject(err);
                    } else if(rows.affectedRows > 0){
                        resolve("Categoría eliminada con éxito!");
                    } else {
                        reject("No se encontró una categoría con ese ID.")
                    }
                })
    
        })

    }
}

module.exports = Categoria;