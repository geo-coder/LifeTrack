const express=require('express')
const router=new express.Router
const User = require('../models/user')
const mongoose=require('mongoose')
const auth=require('../middleware/auth')


router.post('/addresses', auth, async (req, res)=>{

    
    
    // try{
    // const user = new User(req.body)
    // user._id=new mongoose.Types.ObjectId
    
    // await user.save()


    // res.sendStatus(200)
    // } catch (e){
    //     res.sendStatus(400).send('na')
    // }
    
    
    const user=await User.findById(req.user._id)

    console.log(req.body.startDate)
    
    //console.log(user.addresses)

    var addressArray=user.addresses

    //console.log(addressArray)
    
    
    
    // console.log("Request start date is date?" + req.body.startDate instanceof Date)
    // console.log("Array start date is date? " + addressArray[0].address.startDate instanceof Date)

    // var dateThing=new Date(req.body.startDate)
    

    // req.body.startDate=dateThing
    // console.log(req.body.startDate instanceof Date)
    
    console.log(req.body.startDate)
    req.body.startDate=new Date(req.body.startDate)
    req.body.endDate=new Date(req.body.endDate)
    
    
    for (var x=0;x<addressArray.length;x++){

        if(req.body.startDate<addressArray[x].address.startDate){
            console.log(req.body.startDate + " is before " +addressArray[x].address.startDate)


        } else if (req.body.startDate>addressArray[x].address.startDate){
            console.log(req.body.startDate + " is later than " +addressArray[x].address.startDate) //greater is later
        }


    }

    console.log(req.body.startDate.getTime())


    user.addresses=user.addresses.concat({address: req.body})
    
    // console.log('addreses route')
    // console.log(req.user._id)
    
    //user.save()
    res.send(user)

})

module.exports=router