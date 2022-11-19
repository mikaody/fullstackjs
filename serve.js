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


app.get('/save', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'test', 'save.html'))
})

app.use('/api/todo', todo_router) // no auth used
app.use('/api/user', user_router) // no auth used
app.use('/api/auth', auth_router) // no auth used
app.use('/', express.static('public'))
app.use('/assets/images', express.static('public/assets/images'))
app.get('/backend', (req, res) => res.send('Hello World!'))

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