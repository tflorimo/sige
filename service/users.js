
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
        
        if(!validarClave(params.clave)){
            reject("La clave debe tener al menos 4 caracteres y al menos una letra.");
        }

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

        if(!validarClave(params.clave)){
            reject("La clave debe tener al menos 4 caracteres y al menos una letra.");
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
* Valida que el largo de la clave sea mayor a 4 y tenga al menos una letra
*/
function validarClave(clave){
    if(clave.length < 4){
        return false;
    }
    if(/[a-z]/.test(clave) == false){
        return false;
    }
    return true;
}

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

module.exports = {
    registrarUsuario,
    actualizarUsuario,
    buscarUsuario,
    listarUsuarios
}