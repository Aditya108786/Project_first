//
const express = require('express')
const app = express()
const cookieparser = require('cookie-parser')
const cors = require('cors')
const path = require('path')


app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true,
})
)
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieparser());

//routes import
const routes  = require('./routes/usser.router')

//routes declaration
app.use('/users', routes)



module.exports = app;