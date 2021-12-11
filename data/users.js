const conn = require('./connection')

// Clase user para el manejo de usuarios
class User {
    // Agrega un nuevo usuario a la base de datos, previo valida que existan todos los campos
    addUser = (params) => {
        return new Promise((resolve, reject) => {
            // Si ADMIN o GENERO no es ni cero ni uno no pasa
            if (params.admin > 1) {
                reject("El valor de administrador debe ser 1 o 0.");
            } else if (params.genero > 1) {
                reject("El valor de género debe ser 1 para mujer, o 0 para hombre.")
            // Valida con una regexp que el mail sea valido
            } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(params.email)) {
                reject("El email ingresado es inválido.");
            } else {
                // conn.query('INSERT INTO users (login, clave, nombre_completo, telefono, email, genero, admin) VALUES (?, ?, ?, ?, ?, ?, ?)', [login, clave, nombre_completo, telefono, email, genero, admin], (err, res) => {
                conn.query('INSERT INTO users (login, clave, nombre_completo, telefono, email, genero, admin) VALUES (?, ?, ?, ?, ?, ?, ?)', [params.login, params.clave, params.nombre_completo, params.telefono, params.email, params.genero, params.admin], (err, res) => {
                    if(err) {
                        reject(err)
                    } else {
                        resolve("Usuario creado con éxito!")
                    }
                })
            }
        })
    }

    // Busca un usuario en la base de datos por su login
    findUserByLogin = (login) => {
        return new Promise((resolve, reject) => {
            conn.query("SELECT idusuario, login, clave, admin FROM users WHERE login = '" + login + "'", function(err, rows, fields) {
                if (err) {
                    reject(err);
                } else if (rows.length == 0) {
                    resolve(false);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    }

    // Busca un usuario en la base de datos por su ID
    findUserById = (id) => {
        return new Promise((resolve, reject) => {
            conn.query("SELECT * FROM users WHERE idusuario = '" + id + "'", function(err, rows, fields) {
                if (err) {
                    reject(err);
                } else if(rows.length > 0) {
                    resolve(rows);
                } else {
                    reject("No se encontró un usuario con ese ID.");
                }
            });
        });
    }

    // Muestra el nombre de los usuarios en la base de datos y si son administradores o no
    getUsers = () => {
        return new Promise((resolve, reject) => {
            conn.query("SELECT login, nombre_completo, admin FROM users", function(err, rows, fields) {
                if (err) throw err;
                if(rows.length > 0) {
                    for(let i = 0; i < rows.length; i++) {
                        rows[i].admin = rows[i].admin == 1 ? "Administrador" : "Usuario";
                    }
                    resolve(rows);
                } else {
                    reject(false);
                }
            });
        });
    }

    // Recibe una ID y un objeto y actualiza el usuario en la base de datos
    updateUser = (id, datos) => {
        return new Promise((resolve, reject) => {
            // Si admin o genero es mayor a 1 no pasa
            if (datos.admin && datos.admin > 1) {
                reject("El valor de administrador debe ser 1 o 0.");
            } else if (datos.genero && datos.genero > 1) {
                reject("El valor de género debe ser 1 para mujer, o 0 para hombre.")
            // Valida con una regexp que el mail sea valido
            } else if (datos.email && (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(datos.email))) {
                reject("Mail inválido.");
            } else {
                conn.query("UPDATE users SET ? WHERE idusuario = ?", [datos, id], function(err, rows, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Usuario actualizado con éxito!");
                    }
                });
            }
        });
    }

}

module.exports = User;