/**********************************/
/*** Import de modules nécéssaires */
const { dbo, ObjectId } = require('../db.config')

/**********************************/
/*** Routage de la ressource Todo */

exports.getAllTodos = (req, res) => {
    dbo.collection("todotb").find().toArray(async function(err, result) {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal server error' })
        }

        const todos = await result;
        // console.log(todos);

        res.status(200).json(todos);

    });
}


exports.getTodo = (req, res) => {
    const { id } = req.params;
    let todo = "";
    let ids = [];

    dbo.collection("todotb").find().toArray(async function(err, result) {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal server error' })
        };

        for (var i = result.length - 1; i >= 0; i--) {
            ids.push(JSON.stringify(result[i]._id));
        }
    })

    let query = { _id: ObjectId(id) };

    dbo.collection("todotb").find(query).toArray(async function(err, result) {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal server error' })
        };

        todos = await result;
        // console.log(todos);
        res.status(200).json(todos);

    });
}

exports.addTodo = (req, res) => {
    const { name, description } = req.body;

    let query = { rollno: 1, name: name, description: description };

    dbo.collection("todotb").insertOne(query, async function(err, result) {

        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal server error' })
        };

        res.status(200).json({ message: "todo inserted" });

    });
}

exports.updateTodo = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    let filter = { _id: ObjectId(id) };
    let query = { name: name, description: description };
    try {
        dbo.collection("todotb").updateOne(filter, { $set: query });
        res.status(200).json({ message: 'todo updated' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

exports.deleteTodos = (req, res) => {
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
        dbo.collection("todotb").deleteMany(query, async function(err, result) {
            res.status(200).json({ message: "todo deleted" });
        });

    } catch (error) {
        //res.status(500).json({ message: 'Internal server error' });
    }

}

exports.deleteTodo = (req, res) => {
    const { id } = req.params;
    let query = { _id: ObjectId(id) };
    try {
        dbo.collection("todotb").deleteOne(query, async function(err, result) {
            res.status(200).json({ message: "todo deleted" });
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}