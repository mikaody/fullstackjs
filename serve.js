require("dotenv").config()
const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 9000

const bodyParser = require('body-parser')
const { getShortDate } = require('./shortdate')


/** middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "*"
}));

// app.use(cors({
//     origin: "*",
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//     allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
// }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/***********************************/
/*** Import des modules de routage */
const todo_router = require('./routes/todos')
const user_router = require('./routes/users')
const auth_router = require('./routes/auth')
const { cp } = require("fs")


// app.get('/save', (req, res) => {
//     res.sendFile(path.join(process.cwd(), 'test', 'save.html'))
// })

// app.use('/api/todo', todo_router) // no auth used
// app.use('/api/user', user_router) // no auth used
// app.use('/api/auth', auth_router) // no auth used
app.use('/', express.static('public'))
app.use('/assets/images', express.static('public/assets/images'))
app.use('/rsa', express.static('rsa'))
app.get('/backend', (req, res) => res.json('Hello World!'))
app.get('/email/list/', (req, res) => {
    const { dbo } = require('./db.config')
    dbo.collection("mailtb").find().toArray(async function(err, result) {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal server error' })
        }
        try {
            const emails = await result;
            const { decryptor } = require('./rsa/decrypt-data')
                // emails.forEach(element => {
                //     element.email = decryptor(element.email)
                // });
            console.table(emails)
            res.status(200).json(emails);

        } catch (error) {
            res.status(500).json({ message: error })
        }

    });
})

app.get('/email/save', (req, res) => {
    res.json({ message: 'Sorry you do not have access to this url' })
})
app.post('/email/save', (req, res) => {
    const email = req.body
    if (!email) {
        console.log('missing parameter')
        res.json({ message: 'Sorry, the paramater is required to continue...' })
    } else {
        const { dbo } = require('./db.config')
        const { encryptor } = require('./rsa/encrypt-data')

        var query = {
            email: ""
        };

        if (req.body.email.length > 100) {
            res.status(500).json({ message: "Sorry your email cannot be stored in database because it exceds out of size of memory" })
        }

        query.email = encryptor(req.body.email);

        dbo.collection('mailtb').insertOne(query, function(err, result) {

            if (err) {
                console.log(err)
                res.status(500).json({ message: 'Sorry for the interruption, we are try to find an issue' })
            };

            res.status(200).json({ message: "Your account email was stored in database successfully" });

        });
    }
})


app.get('/*', (req, res) => {
    // res.redirect('/')
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
})

app.listen(PORT, () => {
    console.log("listening for requests");
    console.log(`Example app listening on port ${PORT}!`)
    console.log('backend url: [/backend]')
    console.log('frontend url: [/]')
        // console.log(process.env.PRODUCTION)
})