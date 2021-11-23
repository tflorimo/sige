const conn = require('./connection')

// Agrega un nuevo usuario a la base de datos, previo valida que existan todos los campos
const addUser = (login, clave, nombre_completo, telefono, email, genero, admin ) => {
    if(!login || !clave || !nombre_completo || !telefono || !email || !genero || !admin) {
        return false;
    } else {
        return new Promise((resolve, reject) => {
            conn.query('INSERT INTO users (login, clave, nombre_completo, telefono, email, genero, admin) VALUES (?, ?, ?, ?, ?, ?, ?)', [login, clave, nombre_completo, telefono, email, genero, admin], (err, res) => {
                if(err) {
                    reject(err)
                } else {
                    resolve("Usuario creado con éxito!")
                }
            })
        })
    }
}

// Busca un usuario en la base de datos por su login
const findUserByLogin = (login) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT login, clave FROM users WHERE login = '" + login + "'", function(err, rows, fields) {
            if (err) throw err;
            if(rows.length > 0) {
                resolve(rows[0]);
            } else {
                reject(false);
            }
        });
    });
}

const findUserById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM users WHERE idusuario = '" + id + "'", function(err, rows, fields) {
            if (err) throw err;
            if(rows.length > 0) {
                resolve(rows);
            } else {
                reject(false);
            }
        });
    });
}

// Muestra el nombre de los usuarios en la base de datos y si son administradores o no
const getUsers = () => {
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
const updateUser = (idusuario, datos) => {
    return new Promise((resolve, reject) => {
        conn.query("UPDATE users SET ? WHERE idusuario = ?", [datos, idusuario], function(err, rows, fields) {
            if (err) throw err;
            resolve("Usuario actualizado con éxito!");
        });
    });
}

module.exports = { addUser, getUsers, findUserByLogin, updateUser, findUserById }