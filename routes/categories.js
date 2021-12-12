var express = require('express');
var router = express.Router();
const Categoria = require('../service/categories');
const {checkAuth, checkAdmin } = require('../middleware/auth');

// GETS
// Lista todas las categorias
router.get('/', (req,res) => {
    
    Categoria.listarCategorias().then(categorias => {
        res.status(200).json(categorias);
    }).catch(err => {
        res.status(500).send(err);
    })

});

// Busca una categoría por id y lista todos sus productos
router.get('/:idcategoria', (req, res) => {

    let idcategoria = req.params.idcategoria;

    Categoria.listarProductosPorCategoria(idcategoria)
    .then(productos => {
        res.status(200).json(productos);
    })
    .catch(err => {
        res.status(500).send(err);
    })

});

// POSTS 
// Agrega una categoria, solo puede ser llamado por el administrador
router.post('/', checkAuth, checkAdmin, (req, res) => {
    let datos = req.body
    if(Object.keys(req.body).length < 1){
        res.status(400).send("Faltan datos")
    } else {
        let categoria = {descrip: datos.descrip}
        Categoria.agregarCategoria(categoria).then(() => {
            res.status(200).send("Categoria cargada exitosamente.")
        }
        ).catch(err => {
            res.status(500).send("Error cargando categoria: " + err);
        })
    }
});

// PATCHES
// Actualiza una categoria
router.patch('/:id', checkAuth, checkAdmin, (req, res) => {

    let idcategoria = req.params.id;

    let datos = req.body

    let categoria = {
        ...datos.descrip ? {descrip: datos.descrip} : {},
    }
    
    Categoria.actualizarCategoria(idcategoria, categoria)
    .then(() => {
        res.status(200).send("Categoria modificada exitosamente.")
    })
    .catch(err => {
        res.status(500).send("Error modificando categoria: " + err);
    })

});

// DELETE
// Borra una categoria de la base de datos, solo puede ser llamado por el administrador
router.delete('/:id', checkAuth, checkAdmin, (req, res) => {

    let idcategoria = req.params.id;

    Categoria.eliminarCategoria(idcategoria)
    .then(() => {
        res.status(200).send("Categoria eliminada exitosamente.")
    })
    .catch(err => {
        res.status(500).send("Error eliminando categoria: " + err);
    })


});

module.exports = router;