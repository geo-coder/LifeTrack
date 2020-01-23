const express=require('express')
const app=express()
const port=3000
const userRouter=require('../lifetrackapp/routes/userroute')
const addressRouter=require('../lifetrackapp/routes/addressroute')

var cookieParser = require('cookie-parser')

const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))


// /Users/george/mongodb/bin/mongod --dbpath=/Users/george/mongodb-data


const mongodb=require('mongodb')
const mongoose=require('mongoose')

mongoose.set('useUnifiedTopology', true);


const MongoClient=mongodb.MongoClient

const connectionURL='mongodb://127.0.0.1:27017'

const databaseName = 'life-track'

mongoose.connect('mongodb://127.0.0.1:27017/life-track', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,

})








app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: 'true'}))
app.use(bodyParser.json())

app.use(cookieParser())
app.use(userRouter)
app.use(addressRouter)




app.set('views', './views')
app.set('view engine', 'pug')


app.listen(port, ()=>{console.log('server up on port '+port)})