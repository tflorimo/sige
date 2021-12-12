
// Capa de SERVICIO que se encarga de la logica de negocio de los Usuarios

const User = require('../data/users');
const userModel = new User();

/**
*  Conecta con el modelo de bases de datos y trae todos los usuarios.
*/
function listarUsuarios(){
    return new Promise((resolve, reject) => {
        userModel.getUsers()
        .then(users => {
            resolve(users);
        })
        .catch(err => {
            reject(err);
        })
    })
}

/**
* Conecta con el modelo de bases de datos y en caso de que todos los parámetros se cumplan, crea un nuevo usuario
* El usuario no debe existir en la base de datos, de lo contrario se lanzará un error
*/
function registrarUsuario(params){
    
    return new Promise((resolve, reject) => {

        userModel.findUserByLogin(params.login)
        .then(user => {
            if(user){
                reject("El usuario ya existe");
            }else{
                userModel.addUser(params)
                .then(user => {
                    resolve("Usuario creado exitosamente");
                })
                .catch(err => {
                    reject(err);
                })
            }
        })
        .catch(err => {
            reject(err);
        })
    })

}

/**
* Conecta con el modelo de bases de datos y en caso de que todos los parámetros se cumplan, actualiza los datos de un usuario
* Para actualizarlo, primero debe encontrarlo por el id que se le pasa como parámetro
*/
function actualizarUsuario(id, params){
    return new Promise((resolve, reject) => {
        if(Object.keys(params).length === 0){
            reject("No se puede actualizar un usuario sin parámetros");
        }
        userModel.findUserById(id)
        .then(user => {
            if(user){
                userModel.updateUser(id, params)
                .then(user => {
                    resolve("Usuario actualizado exitosamente");
                })
                .catch(err => {
                    reject(err);
                })
            } else {
                reject("No se encontró un usuario con ese ID.");
            }
        })
        .catch(err => {
            reject(err);
        })
    })
}

/**
* Busca al usuario según el login enviado por parámetros, y en caso de que lo encuentre, compara la clave que también se envía
* por parámetros en el objeto "params" y compara que sean iguales, 
*/
function login(params){
    return new Promise((resolve, reject) => {
        userModel.findUserByLogin(params.login)
        .then(user => {
            if(user){
                if(user.clave == params.clave){
                    resolve(user);
                } else {
                    reject("La clave es incorrecta");
                }
            } else {
                reject("No se encontró un usuario con ese login");
            }
        })
        .catch(err => {
            reject(err);
        })
    })
}

/**
 * Conecta con el modelo de bases de datos y busca al usuario según la ID enviada en parámetros
 */
function buscarUsuario(id){
    return new Promise((resolve, reject) => {
        userModel.findUserById(id)
        .then(user => {
            resolve(user);
        })
        .catch(err => {
            reject(err);
        })
    })
}

function eliminarUsuario(id){
    return new Promise((resolve, reject) => {
        userModel.deleteUser(id)
        .then(user => {
            resolve("Usuario eliminado exitosamente");
        })
        .catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    buscarUsuario,
    login,
    listarUsuarios
}