/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const todoCtrl = require('../controllers/todo')

/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/*********************************************/
/*** Middleware pour logger dates de requete */
router.use((req, res, next) => {
    const event = new Date()
    console.log('Todo Time:', event.toString())
    next()
})


/**********************************/
/*** Routage de la ressource User */

router.get('/', todoCtrl.getAllTodos);

router.get('/:id', todoCtrl.getTodo);


router.post('/', todoCtrl.addTodo)

router.post('/:id', todoCtrl.updateTodo)

router.delete('/', todoCtrl.deleteTodos)

router.delete('/:id', todoCtrl.deleteTodo)

module.exports = router