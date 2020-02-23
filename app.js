const express=require('express')
const app=express()
const port = process.env.PORT 
const userRouter=require('../lifetrackapp/routes/userroute')
const addressRouter=require('../lifetrackapp/routes/addressroute')
const helmet = require('helmet')
const rateLimit = require("express-rate-limit")

var cookieParser = require('cookie-parser')

const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))


// /Users/george/mongodb/bin/mongod --dbpath=/Users/george/mongodb-data


const mongodb=require('mongodb')
const mongoose=require('mongoose')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'exceeded request limit, please try again later'
  });

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

// const MongoClient=mongodb.MongoClient

// const connectionURL='mongodb://127.0.0.1:27017'

// const databaseName = 'life-track'

mongoose.connect('mongodb://127.0.0.1:27017/life-track', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,

})




app.use(helmet())

app.use(limiter);
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: 'true'}))
app.use(bodyParser.json())

app.use(cookieParser())
app.use(userRouter)
app.use(addressRouter)




app.set('views', './views')
app.set('view engine', 'pug')
app.set('trust proxy', 1)





app.listen(port, ()=>{console.log('server up on port '+ port)})