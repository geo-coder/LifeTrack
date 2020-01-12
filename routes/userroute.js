const express=require('express')
const router=new express.Router
const User = require('../models/user')
const mongoose=require('mongoose')
const auth=require('../middleware/auth')
const cookieParser = require('cookie-parser')
const bcrypt=require('bcryptjs')


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
    res.cookie('token', token).redirect('/addresses')
    

    } catch (e){
        
        if (e.code===11000) {e.message='Sorry, that e-mail is already registered with Life-Track.'}
        if (e.name==='ValidationError') {
            var compMessages = ''
            for (field in e.errors) {
                
                
                compMessages = compMessages + e.errors[field].properties.message + '\r\n'
                
                
            }
            e.message=compMessages
            
        }
        
        
        
        res.render('simpleError', {message:e.message,goback:'/newuser'})
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
        res.sendStatus(500).send('Bad request')
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
    
    
    try{
        // if(!user){
        //     throw new Error("nah")
        // }

        const user = await User.findByCredentials(req.body.email, req.body.password)
        //await user.genAuthToken()

        const token = await user.genAuthToken()
        await user.save()
        //res.send(user)
        res.cookie('token', token).redirect('/addresses')

        

    } catch(e){
        console.log('error caught', e)
        res.sendStatus(400)

    }


})



router.get('/logout', auth, async (req, res)=>{

    
    const user=await User.findById(req.user._id)

    try {

        //req.user.tokens=[]
        //await req.user.save()

        user.tokens=[]
        await user.save()
        //res.send(req.user)
        res.redirect('/')
    } catch (e) {
        res.status(500).send()

    }


})


router.get('/me', auth, async (req, res) => {
    res.send(req.user)
    })






router.get('/view_profile', auth, async(req, res) =>{

    res.render('view_profile', {firstName:req.user.firstName, lastName:req.user.lastName, email:req.user.email})


})



router.get('/update_profile', auth, async(req, res) =>{
    res.render('update_profile', {firstName:req.user.firstName, lastName:req.user.lastName, email:req.user.email})
})



router.post('/update_profile', auth, async(req, res) =>{
    
    //const user = await User.findByCredentials(req.body.email, req.body.password)    
    
    const user=await User.findById(req.user._id)
    
    user.firstName=req.body.firstName
    user.lastName=req.body.lastName
    user.email=req.body.email
    
    //console.log(req.body)
    //console.log(user)

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
        
        
        // await bcrypt.compare(req.body.oldPW, user.password, function(err, result){
    
            
        // })

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
        //console.log(e.message)
        //res.sendStatus(400)
        res.render('error', {message:e.message, goback:'/change_pw'})


    }
})


router.get('/delete_profile', auth, async (req, res)=>{

    const user=await User.findById(req.user._id)
    await user.remove()

    res.redirect('/')
})


module.exports=router