/***********************************/
/*** Import des module nécessaires */
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { dbo } = require('../db.config')

/**********************************/
/*** Routage de la ressource Auth */

exports.login = (req, res) => {
    const { email, password } = req.body

    // Validation des données reçues
    if (!email || !password) {
        res.status(400).json({ message: 'Bad email or password' })
    }
    // Vérification si l'utilisateur existe
    let query0 = { email: req.body.email };

    dbo.collection("usertb").find(query0).toArray((err, data) => {
        if (err) throw err
        if (!data) {
            console.log('This account does not exists !')
            res.status(401).json({ message: 'This account does not exists !' })
        }

        // Vérification du mot de passe
        let test = bcrypt.compare(req.body.password, data[0].password);

        if (!test) {
            console.log(test)
            res.status(401).json({ message: 'Wrong password' })
        }

        // Génération du token et envoi
        const token = jwt.sign({
            email: data[0].email,
            password: data[0].password,
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING })

        res.json({ access_token: token })
    })

}

exports.verifyToken = (req, res) => {
    const { token } = req.body

    // Validation des données reçues
    if (token == null) {
        res.status(400).json({ token: 'Token is required' })
    }

    const extracted_token = jwt.decode(token);
    console.log(extracted_token.email)
    console.log(extracted_token.password)
    let query1 = ''
    if (extracted_token.email !== null) {
        query1 = { email: extracted_token.email }
    }
    dbo.collection("usertb").find(query1).toArray((err, data) => {
        if (err) throw err
        if (data.length == 0) {
            console.log('This account does not exists !')
            res.status(500).send('This account does not exists !')
        }

        // Vérification du mot de passe
        let verifypassword = extracted_token.password == data[0].password;
        console.log('token is ok? ', verifypassword)
        res.status(200).json({ isOk: verifypassword })
    })


}