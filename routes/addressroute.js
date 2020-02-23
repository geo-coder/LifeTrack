const express=require('express')
const router=new express.Router
const User = require('../models/user')
const mongoose=require('mongoose')
const auth=require('../middleware/auth')
const insertAddress=require('../services/insertAddress')
const undoInsert=require('../services/undoInsert')
const rateLimit = require("express-rate-limit")



function compareDates(a,b) {
                
    var compStartDate1=new Date(a.address.startDate)
    var compStartDate2=new Date(b.address.startDate)
    
    return compStartDate2 - compStartDate1

}


// router.use(function (req, res, next) {
    
//     console.log('before body')
//     console.log(req.body)
    
//     if (req.body){

//         for(x in req.body){

//             console.log(req.body[x])
//             req.body[x]=validator.escape(req.body[x])

//         }


//     }    
        
//     console.log('After body')
//     console.log(req.body)
    
//     next()
// })



const addressPostLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min window
    max: 100, // start blocking after 100  requests
    message:
      "Exceeded limit on new address entries. Try again later."
  });

router.post('/addresses', addressPostLimiter, (req, res, next) => {  //rate blocking middleware for address posts
    next()
}) 


  

//ADD A NEW ADDRESS
router.post('/addresses', auth, async (req, res)=>{ //, check('addressLineOne').escape()]

    
    
    
    const user=await User.findById(req.user._id)

    if (user.addresses.length<=99) {
   
    insertAddress(user, req, res, '/new_address')

    
    //res.redirect('/addresses')

    } else {


        res.render('simpleError', {message:'Maximum address limit of 100 reached', goback:'/addresses', buttontext: 'OK'})
    }




})



//undo



router.get('/undo', auth, async (req, res)=>{

    const user=await User.findById(req.user._id)

    
    
    if (user.deletedAddresses[0]){
        const delAddressLen=user.deletedAddresses.length
        
        req.body=user.deletedAddresses[delAddressLen-1].address

        
        user.deletedAddresses.pop()
        await user.save()
        
        
        undoInsert(user, req, res, '/new_address')
    } else {
        res.end()
    }
    



})





//this route is for testing purposes; inserts four dummy addresses into database

// router.get('/restore', auth, async (req, res)=>{

    
     
//     const user=await User.findById(req.user._id)
    
    
    
//     const dummy=[
//         {
        
//             address : {
//                 addressLineOne : "A",
//                 unitNo : "",
//                 city : "City",
//                 state : "ST",
//                 zip : "",
//                 notes : "Notes",
//                 startDate : "2020-01-01",
//                 endDate : "2020-01-09",
//                 formattedEnd : "01/09/2020",
//                 formattedStart : "01/01/2020"
//             }
//         },

//         {
        
//             address : {
//                 addressLineOne : "B",
//                 unitNo : "",
//                 city : "City",
//                 state : "ST",
//                 zip : "",
//                 notes : "Notes",
//                 startDate : "2010-01-01",
//                 endDate : "2015-01-09",
//                 formattedEnd : "01/09/2015",
//                 formattedStart : "01/01/2010"
//             }
//         },

//         {
        
//             address : {
//                 addressLineOne : "C",
//                 unitNo : "",
//                 city : "City",
//                 state : "ST",
//                 zip : "",
//                 notes : "Notes",
//                 startDate : "1990-01-01",
//                 endDate : "2000-01-09",
//                 formattedEnd : "01/09/2000",
//                 formattedStart : "01/01/1990"
//             }
//         },


//         {
        
//             address : {
//                 addressLineOne : "D",
//                 unitNo : "",
//                 city : "City",
//                 state : "ST",
//                 zip : "",
//                 notes : "Notes",
//                 startDate : "1980-01-01",
//                 endDate : "1985-01-09",
//                 formattedEnd : "01/09/1985",
//                 formattedStart : "01/01/1980"
//             }
//         }


//     ]
    
    
    
    
//     user.addresses=user.addresses.concat(dummy)
    

//     user.save()
//     res.redirect('/addresses')

// })




//view single address for editing purposes


router.get('/edit_address/:id', auth, async (req, res)=>{

    const user=await User.findById(req.user._id)
    const address_id=req.params.id

    const foundAddressIndex=user.addresses.findIndex((element)=>element.id===address_id)
    
    const found=user.addresses[foundAddressIndex].address
    const _id=user.addresses[foundAddressIndex]._id
    //console.log(found.notes)
    
    res.render('edit_address', { address: found, _id})


})

//save the edited address to db
router.post('/edit_address/:id', auth, async (req, res)=>{ //check('*').escape()
    const user=await User.findById(req.user._id)
    const address_id=req.params.id

    const foundAddressIndex=user.addresses.findIndex((element)=>element.id===address_id)
    
    


    
    const filter = {'_id':req.user._id,  "addresses": { "$elemMatch": { "_id": address_id }}}
    const update={'addresses.$.address.$.addressLineOne': 'bullshit address'}
    const update2={'userName':'barnowl'}   

    let doc=await User.findOneAndUpdate(filter, update, {
        new: true
      })

    
      let findThing=User.findOne(filter)
    user.addresses[foundAddressIndex].address.addressLineOne=req.body.addressLineOne
    user.addresses[foundAddressIndex].address.unitNo=req.body.unitNo
    user.addresses[foundAddressIndex].address.city=req.body.city
    user.addresses[foundAddressIndex].address.state=req.body.state
    user.addresses[foundAddressIndex].address.zip=req.body.zip
    user.addresses[foundAddressIndex].address.notes=req.body.notes
    user.addresses[foundAddressIndex].address.startDate=req.body.startDate
    user.addresses[foundAddressIndex].address.endDate=req.body.endDate
    user.addresses[foundAddressIndex].address.toPresent=req.body.toPresent
    
    
    
    
    const startElements = req.body.startDate.split('-')

    const formattedStart=`${startElements[1]}/${startElements[2]}/${startElements[0]}`
    let formattedEnd
    if(req.body.toPresent){
        formattedEnd = "to Present"
    } else {
        const endElements=req.body.endDate.split('-')
        formattedEnd=`${endElements[1]}/${endElements[2]}/${endElements[0]}`

    }

    
    
    
    
    user.addresses[foundAddressIndex].address.formattedStart=formattedStart
    user.addresses[foundAddressIndex].address.formattedEnd=formattedEnd

    


    
    
    await user.save()
    
    
    // user.addresses.splice(foundAddressIndex,1)
    // var back= '/edit_address/'+address_id
    
    // insertAddress(user, req, res, back)

    user.addresses=user.addresses.sort(compareDates)
    
    res.render('addresses', { addresses: user.addresses})
    
    
    


})

//view all addresses
router.get('/addresses', auth, async (req, res) =>{
    
    const user=await User.findById(req.user._id)

    
    
    
    
    
    
    //this just gives a user-friendly date format mm/dd/yyyy

    for (x=0;x<user.addresses.length;x++){
        const startElements=user.addresses[x].address.startDate.split('-')
        
        user.addresses[x].address.startMonth=startElements[1]
        user.addresses[x].address.startDay=startElements[2]
        user.addresses[x].address.startYear=startElements[0]
        
        user.addresses[x].address.formattedStart=startElements[1] + '/' + startElements[2] + '/' + startElements[0] 

        if (user.addresses[x].address.endDate==='present') {
            user.addresses[x].address.formattedEnd="present"
        } else {
            const endElements=user.addresses[x].address.endDate.split('-')
            user.addresses[x].address.endMonth=endElements[1]
            user.addresses[x].address.endDay=endElements[2]
            user.addresses[x].address.endYear=endElements[0]
        
            user.addresses[x].address.formattedEnd=endElements[1] + '/' + endElements[2] + '/' + endElements[0] 

        }
        if (!user.addresses[x].address.zip) {
            user.addresses[x].address.zip=""
        }


    }
    
    await user.save()
    
    
        
    
    user.addresses=user.addresses.sort(compareDates)
    
    
    
    res.render('addresses', { addresses: user.addresses})
})




//delete a single address

router.delete('/addresses/:id', auth, async(req, res)=>{

    const user=await User.findById(req.user._id)

    const _id=req.params.id

    try {
        
        
        
        const deleteIndex=user.addresses.findIndex((element)=>element.id===_id)
        
        
        //user.addresses=user.addresses.concat({address: req.body})
        
        user.deletedAddresses=user.deletedAddresses.concat(user.addresses[deleteIndex])
        
        //del first

        if (user.deletedAddresses.length===100) { //100 max for undo storage
            user.deletedAddresses.shift()
        }



        user.addresses.splice(deleteIndex,1)
        await user.save()
 


        res.send(user.addresses)

    } catch (e) {


        res.sendStatus(500).render('newaddresserror', {error: e.message})
    }



})



router.get('/view_text', auth, async(req, res)=>{
    const user=await User.findById(req.user._id)
    
    res.render('view_text', {addresses:user.addresses})



})

router.get('/new_address', auth, async (req, res)=>{

    res.render('new_address')




})




module.exports=router