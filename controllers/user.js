/**********************************/
/*** Import de modules nécéssaires */
require('dotenv').config()
const bcrypt = require('bcrypt')

const { dbo, ObjectId } = require('../db.config')

/**********************************/
/*** Routage de la ressource User */

exports.getAllUsers = (req, res) => {
    dbo.collection("usertb").find().toArray(async function(err, result) {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal server error' })
        }

        const users = await result;
        // console.log(users);

        res.status(200).json(users);

    });
}


exports.getUser = (req, res) => {
    const { id } = req.params;
    let ids = [];

    dbo.collection("usertb").find().toArray(async function(err, result) {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal server error' })
        };

        for (var i = result.length - 1; i >= 0; i--) {
            ids.push(JSON.stringify(result[i]._id));
        }
    })

    let query = { _id: ObjectId(id) };

    dbo.collection("usertb").find(query).toArray(async function(err, result) {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal server error' })
        };

        users = await result;
        // console.log(users);
        res.status(200).json(users);

    });
}

exports.addUser = async(req, res) => {

    const { email, password } = req.body;

    // Validation des données reçues
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing Data' })
    }

    try {
        // Vérification si l'utilisateur existe déjà
        let query0 = { email: req.body.email };

        dbo.collection("usertb").find(query0).toArray(async function(err, result) {
            if (err) {
                console.log(err)
                res.status(500).json({ message: 'Internal server error' })
            };

            user = await result;
            console.log(user[0]);
            res.status(200).json({ message: `Utilisateur ${user[0].email} existe déjà` });

        });



        // Hashage du mot de passe utilisateur
        let hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
        req.body.password = hash

        // Céation de l'utilisateur
        let query = { email: email, password: req.body.password };

        dbo.collection("usertb").insertOne(query, async function(err, result) {

            if (err) {
                console.log(err)
                res.status(500).json({ message: 'Internal server error' })
            };

            res.status(200).json({ message: "user inserted" });

        });

    } catch (err) {
        res.status(500).json({ message: 'Database Error', error: err })
    }

}

exports.updateUser = async(req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;
    let filter = { _id: ObjectId(id) };

    // Hashage du mot de passe utilisateur
    let hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
    req.body.password = hash
    let query = { email: email, password: req.body.password };

    try {
        dbo.collection("usertb").updateOne(filter, { $set: query });
        res.status(200).json({ message: 'user updated' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

exports.deleteUsers = (req, res) => {
    const { many } = req.body;
    console.log(many);
    ids = many.split("+");
    idObs = [];
    ids.forEach(id => {
        idObs.push(ObjectId(id));
    });
    let query = { _id: { $in: idObs } }
        // query = { _id: ObjectId(id) };

    try {
        dbo.collection("usertb").deleteMany(query, async function(err, result) {
            res.status(200).json({ message: "user deleted" });
        });

    } catch (error) {
        //res.status(500).json({ message: 'Internal server error' });
    }

}

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    let query = { _id: ObjectId(id) };
    try {
        dbo.collection("usertb").deleteOne(query, async function(err, result) {
            res.status(200).json({ message: "user deleted" });
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}