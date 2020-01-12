const express=require('express')
const router=new express.Router
const User = require('../models/user')
const mongoose=require('mongoose')
const auth=require('../middleware/auth')
const insertAddress=require('../services/insertAddress')

//ADD A NEW ADDRESS
router.post('/addresses', auth, async (req, res)=>{

    
    
    
    const user=await User.findById(req.user._id)

   
    insertAddress(user, req, res, '/new_address')

    
    //res.redirect('/addresses')


})



//restore

router.get('/restore', auth, async (req, res)=>{

    
     
    const user=await User.findById(req.user._id)
    
    
    
    const dummy=[
        {
        
            address : {
                addressLineOne : "A",
                unitNo : "",
                city : "City",
                state : "ST",
                zip : "",
                notes : "Notes",
                startDate : "2020-01-01",
                endDate : "2020-01-09",
                formattedEnd : "01/09/2020",
                formattedStart : "01/01/2020"
            }
        },

        {
        
            address : {
                addressLineOne : "B",
                unitNo : "",
                city : "City",
                state : "ST",
                zip : "",
                notes : "Notes",
                startDate : "2010-01-01",
                endDate : "2015-01-09",
                formattedEnd : "01/09/2015",
                formattedStart : "01/01/2010"
            }
        },

        {
        
            address : {
                addressLineOne : "C",
                unitNo : "",
                city : "City",
                state : "ST",
                zip : "",
                notes : "Notes",
                startDate : "1990-01-01",
                endDate : "2000-01-09",
                formattedEnd : "01/09/2000",
                formattedStart : "01/01/1990"
            }
        },


        {
        
            address : {
                addressLineOne : "D",
                unitNo : "",
                city : "City",
                state : "ST",
                zip : "",
                notes : "Notes",
                startDate : "1980-01-01",
                endDate : "1985-01-09",
                formattedEnd : "01/09/1985",
                formattedStart : "01/01/1980"
            }
        }


    ]
    
    
    
    
    user.addresses=user.addresses.concat(dummy)
    

    user.save()
    res.redirect('/addresses')

})




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
router.post('/edit_address/:id', auth, async (req, res)=>{
    const user=await User.findById(req.user._id)
    const address_id=req.params.id

    const foundAddressIndex=user.addresses.findIndex((element)=>element.id===address_id)
    
    
    user.addresses.splice(foundAddressIndex,1)
    var back= '/edit_address/'+address_id
    
    insertAddress(user, req, res, back)
    
    
    
    //user.addresses[foundAddressIndex]=req.body

    
    // user.addresses[foundAddressIndex].address=req.body
    
    // function compareDates(a,b) {
                
    //     var compStartDate1=new Date(a.address.startDate)
    //     var compStartDate2=new Date(b.address.startDate)
        
    //     return compStartDate2 - compStartDate1

    // }
    // user.addresses=user.addresses.sort(compareDates)

    // user.save()

    //res.redirect('/addresses')


})

//view all addresses
router.get('/addresses', auth, async (req, res) =>{
    
    const user=await User.findById(req.user._id)

    //res.send(user.addresses)
    
    
    //res.render('addresses', { title: 'Hey Idiot', message: 'Hello there!', addresses: user.addresses})
    
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



    
    res.render('addresses', { addresses: user.addresses})
})




//delete a single address

router.delete('/addresses/:id', auth, async(req, res)=>{

    const user=await User.findById(req.user._id)

    const _id=req.params.id

    try {
        //console.log(_id)
        //console.log('user', user)
        
        //console.log("this is the ide thing", user.addresses[0].id)
        
        //console.log(_id===user.addresses[0].id)
        
        //console.log('before: ', user.addresses)
        
        
        const deleteIndex=user.addresses.findIndex((element)=>element.id===_id)
        
        
        //user.addresses=user.addresses.concat({address: req.body})
        
        //user.deletedAddresses=user.deletedAddresses.concat(user.addresses[deleteIndex])
        
        user.addresses.splice(deleteIndex,1)
        await user.save()
 


        res.send(user.addresses)

    } catch (e) {


        res.sendStatus(500).render('newaddresserror', {error: e.message})
    }



})



router.get('/view_text', auth, async(req, res)=>{
    const user=await User.findById(req.user._id)
    
    res.render('view_text', {addresses:user.addresses, firstName:user.firstName, lastName:user.lastName})



})

router.get('/new_address', auth, async (req, res)=>{

    res.render('new_address')




})




module.exports=router