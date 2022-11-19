/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const usersCtrl = require('../controllers/user')

/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/*********************************************/
/*** Middleware pour logger dates de requete */
router.use((req, res, next) => {
    const event = new Date()
    console.log('User Time:', event.toString())
    next()
})


/**********************************/
/*** Routage de la ressource User */

router.get('/', usersCtrl.getAllUsers);

router.get('/:id', usersCtrl.getUser);

router.post('/', usersCtrl.addUser)

router.post('/:id', usersCtrl.updateUser)

router.delete('/', usersCtrl.deleteUsers)

router.delete('/:id', usersCtrl.deleteUser)

module.exports = router