const express=require('express')
const router=new express.Router
const User = require('../models/user')
const mongoose=require('mongoose')
const auth=require('../middleware/auth')
const cookieParser = require('cookie-parser')


// router.post('/users', async (req, res)=>{
//         console.log('post')

//     const user = new User(req.body)

//     try {
//         await user.save()

//     } catch (e) {
//         console.log("nope")
//         res.sendStatus(e).send(400)
//     }





// })


router.get('/', async (req, res) => {
    res.render('index', { title: 'Hey Idiot', message: 'Hello there!' })
  })






router.get('/newuser',async (req, res) => {

    res.render('newuser')
  
})


router.get('/userarea', auth, async (req,res) =>{

    
    res.render('userarea')
    


})




  //create new user (post)
router.post('/users', async (req, res)=>{

    
    // console.log("Post request worked")

    // res.send("posted")

    // try {
    //     res.sendStatus(200).send('ok')
    // }   catch (e) {
    //     res.sendStatus(e).send(400)
    // }

    //console.log(req.body)
    
    try{
    const user = new User(req.body)
    user._id=new mongoose.Types.ObjectId
    
    const token = await user.genAuthToken()

    await user.save()
    //console.log('token just before saving cookie', token)
        
    //res.cookie('token', token).sendStatus(200) //.redirect('/userarea')
    res.cookie('token', token).redirect('/userarea')
    

    } catch (e){
        res.sendStatus(400).send('na')
    }
    
})


//find user by id
router.get('/users/:id', async (req, res)=>{
    

    try{
        const _id = req.params.id

        const user = await User.findById(_id)

        if(!user){
            throw new Error()
        }

        res.send(user)
    } catch(e){
        res.sendStatus(500).send('na')
    }








})






router.get('/users', async (req,res)=>{

    res.send("hello")
    


})


router.get('/login', async(req, res)=>{


    res.render('loginscreen')
})




//login route
router.post('/login', async(req,res)=>{
    console.log("login route",req.body.email, req.body.password)
    
    try{
        // if(!user){
        //     throw new Error("nah")
        // }

        const user = await User.findByCredentials(req.body.email, req.body.password)
        await user.genAuthToken()

        
        
        res.send(user)

        

    } catch(e){
        console.log('error caught', e)
        res.sendStatus(400)

    }


})



router.get('/logout', auth, async (req, res)=>{


    try {

        req.user.tokens=[]
        await req.user.save()
        //res.send(req.user)
        res.redirect('/')
    } catch (e) {
        res.status(500).send()

    }


})


router.get('/me', auth, async (req, res) => {
    res.send(req.user)
    })






module.exports=router