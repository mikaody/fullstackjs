/***********************************/
/*** Import des module nécessaires */
const { MongoClient } = require('mongodb');
const URLDB = process.env.MONGO_CONNECTION_STRING || 'mongodb+srv://eshop-user:DHXMdyKAHAlyBGa9@cluster0.nywxf.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(URLDB);
exports.client = client

const dbo = client.db("tododb");
const ObjectId = require('mongodb').ObjectID;

exports.ObjectId = ObjectId
exports.dbo = dbo