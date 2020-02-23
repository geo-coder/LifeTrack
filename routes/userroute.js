const express=require('express')
const router=new express.Router
const User = require('../models/user')
const mongoose=require('mongoose')
const auth=require('../middleware/auth')
const cookieParser = require('cookie-parser')
const bcrypt=require('bcryptjs')
const rateLimit = require("express-rate-limit")



const newAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 min window
    max: 10, // start blocking after 10  requests
    message:
      "To many accounts created from this IP. Try again later."
  });

router.post('/users', newAccountLimiter, (req, res, next) => {  //rate limiting middleware for new user accounts
    next()
}) 







router.get('/', async (req, res) => {    
    res.render('index')
  })






router.get('/newuser',async (req, res) => {

    res.render('newuser')
  
})


router.get('/userarea', auth, async (req,res) =>{

    
    res.render('userarea')
    


})




  //create new user (post)
router.post('/users', async (req, res)=>{    
    
    
    try{
    
    
    
    const userNumber = await User.countDocuments()
    
    const oldestDocument = await User.find().sort({_id: 1}).limit(1)
    
    
     if (userNumber===100){ //for demo purposes this code limits collection size to 100 records; oldest record deleted with every addition above 100

        User.deleteOne({_id:oldestDocument[0]._id}, function (err) {


            if (err) throw new Error
        })


    }
    
    
    
   
    
    
    
    
    const user = new User(req.body)
    user._id=new mongoose.Types.ObjectId
    
    const token = await user.genAuthToken()

    await user.save()
    
        
    //res.cookie('token', token).sendStatus(200) //.redirect('/userarea')
    res.cookie('token', token).redirect('/addresses')
    

    } catch (e){
        
        if (e.code===11000) {
            
            
            e.message='Sorry, that username is already registered with Life-Track.'}
        if (e.name==='ValidationError') {
            var compMessages = ''
            for (field in e.errors) {
                
                
                compMessages = compMessages + e.errors[field].properties.message + '\r\n'
                
                
            }
            e.message=compMessages
            
        }
        
        
        
        res.render('simpleError', {message:e.message,goback:'/newuser', buttontext: 'Retry'})
    }
    
})


// //find user by id
// router.get('/users/:id', async (req, res)=>{
    

//     try{
//         const _id = req.params.id

//         const user = await User.findById(_id)

//         if(!user){
//             throw new Error()
//         }

//         res.send(user)
//     } catch(e){
//         res.sendStatus(500).send('Bad request')
//     }

// })




router.get('/login', async(req, res)=>{


    res.render('loginscreen')
})




//login route
router.post('/login', async(req,res)=>{
    
    
    try{
        

        const user = await User.findByCredentials(req.body.userName, req.body.password)
        //await user.genAuthToken()

        const token = await user.genAuthToken()
        await user.save()
        //res.send(user)
        res.cookie('token', token).redirect('/addresses')

        

    } catch(e){
        
        res.render('simpleError', {message:e.message,goback:'/login', buttontext: 'Retry'})

    }


})



router.get('/logout', auth, async (req, res)=>{

    
    const user=await User.findById(req.user._id)

    try {


        user.tokens=[]
        user.deletedAddresses=[]
        await user.save()
        
        res.redirect('/')
    } catch (e) {
        res.status(500).send()

    }


})


// router.get('/me', auth, async (req, res) => {
//     res.send(req.user)
//     })






router.get('/view_profile', auth, async(req, res) =>{

    res.render('view_profile', {userName:req.user.userName})


})



router.get('/update_profile', auth, async(req, res) =>{
    res.render('update_profile', {userName:req.user.userName})
})



router.post('/update_profile', auth, async(req, res) =>{
    
    
    
    const user=await User.findById(req.user._id)
    
    
    user.userName=req.body.userName
    
    await user.save()


    res.redirect('/view_profile')
})


router.get('/change_pw', auth, async(req, res) =>{
    res.render('change_pw')
})

router.post('/change_pw', auth, async(req, res) =>{
    
    const user=await User.findById(req.user._id)
    
    

    let compareResult = new Boolean   
    
        

    try{
        
        
        

        const match = await bcrypt.compare(req.body.oldPW, user.password)

        if (!match) {
            throw new Error('Wrong password provided.')
        }
        


        if (!req.body.newPW){
            throw new Error('A new password must be provided.')
        }
        
        if (req.body.newPW!==req.body.newPW2){
            throw new Error('Passwords must match.')
        }
        
        
        user.password=req.body.newPW
        await user.save()
        res.redirect('/addresses')

    } catch(e){
        
        res.render('error', {message:e.message, goback:'/change_pw'})


    }
})


router.get('/delete_profile', auth, async (req, res)=>{

    const user=await User.findById(req.user._id)
    await user.remove()

    res.redirect('/')
})


module.exports=router