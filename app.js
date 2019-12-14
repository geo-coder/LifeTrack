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

// MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client) => {
//     if (error) {
//         return console.log('Unable to connect to database!')
//     }
//     const db = client.db(databaseName)



//     // Start to interact with the database

//     // db.collection('users').insertOne({
//     //     name: 'butt',
//     //     age: 27
//     //     })
    
// })



mongoose.connect('mongodb://127.0.0.1:27017/life-track', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,

})







// var userSchema = mongoose.Schema({
//     _id: mongoose.Schema.Types.ObjectId,
//     firstName: String,
//     lastName: String
// })

// var User=mongoose.model('User', userSchema)


// var brian=new User 

// brian._id=new mongoose.Types.ObjectId
// brian.firstName="Brian"
// brian.lastName="Smith"



// brian.save(function(err){

//     if (err) throw err;

//     console.log("successfully saved: ", brian)


// })

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: 'true'}))
app.use(bodyParser.json())

app.use(cookieParser())
app.use(userRouter)
app.use(addressRouter)



app.set('views', './views')
app.set('view engine', 'pug')


app.listen(port, ()=>{console.log('server up on port '+port)})