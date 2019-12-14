const express=require('express')
const router=new express.Router
const User = require('../models/user')
const mongoose=require('mongoose')
const auth=require('../middleware/auth')


//ADD A NEW ADDRESS
router.post('/addresses', auth, async (req, res)=>{

    
    
    
    const user=await User.findById(req.user._id)

   


    

    try {
    
        user.addresses=user.addresses.concat({address: req.body})
        
        // if (user.addresses.length===0){
        //     user.addresses=user.addresses.concat({address: req.body})
        //     await user.save()
        //     //res.send(user)
        //     res.redirect('/addresses')

        // }
        
        
        var submittedStartDate=new Date(req.body.startDate)
        var submittedEndDate

        if (req.body.endDate==='present') {
            submittedEndDate=new Date()
        } else {
            submittedEndDate=new Date(req.body.endDate)
        }
        //validation

        if (submittedStartDate>submittedEndDate) {
            throw new Error ('Start date later than end date.')

        }







        
        var present=false

        
        //section on handling 'present'
        
        
        if (req.body.endDate==='present' && user.addresses[0].address.endDate==='present') {
            
            

            user.addresses[0].address.endDate=req.body.startDate
            
            
            req.body.endDate=new Date().toISOString().split('T')[0] //change 'present' to a simple yyyy/mm/dd string
            present=true
        } else if (req.body.endDate==='present' && user.addresses[0].address.endDate!=='present'){

            req.body.endDate=new Date().toISOString().split('T')[0] 
            present=true


        } else if (req.body.endDate!=='present' && user.addresses[0].address.endDate==='present') {
            user.addresses[0].address.endDate=new Date().toISOString().split('T')[0] 
            present=true
        }

        //console.log("THe concat thing is happening again")
        //user.addresses=user.addresses.concat({address: req.body})
        
        

        function compareDates(a,b) {
                
            var compStartDate1=new Date(a.address.startDate)
            var compStartDate2=new Date(b.address.startDate)
            return compStartDate2 - compStartDate1

        }
        user.addresses=user.addresses.sort(compareDates)
        
        
        
        

        if (present===true) {

            user.addresses[0].address.endDate='present'

        }
        

        // var submittedStartDate=new Date(req.body.startDate)
        // var submittedEndDate

        // if (req.body.endDate==='present') {
        //     submittedEndDate=new Date()
        // } else {
        //     submittedEndDate=new Date(req.body.endDate)
        // }
        
        // if (user.addresses.length===0){
        //     user.addresses=user.addresses.concat({address: req.body})
        // } else if (req.body.endDate==='present') {
        //     user.addresses=user.addresses.concat({address: req.body})
        //     if (user.addresses[user.addresses.length-2].address.endDate==='present'){
                
        //         var prevDate= new Date(req.body.startDate)
        //         prevDate.setDate(prevDate.getDate()-1)
        //         var prevDateString=prevDate.toISOString().split('T')[0]
        //         console.log(prevDateString)
                
        //         //user.addresses[user.addresses.length-2].address.endDate=req.body.startDate
        //         user.addresses[user.addresses.length-2].address.endDate=prevDateString

        //     }
        // } else {
            
        //     for (var x=0; x<user.addresses.length;x++) {

        //         var dbStartDate=new Date(user.addresses[x].address.startDate)
        //         if (submittedEndDate<dbStartDate){
        //             user.addresses.splice(x, 0, {address: req.body})
        //             break
        //         }
        //     }

        // }
                  


    //user.addresses.reverse() //Realized that it would be easier going the other way
    await user.save()
    //res.send(user)
    res.redirect('/addresses')
    
} catch (e) {
    
    console.log(e.message)
    //res.send({error: e.message})
    res.render('newaddresserror', { error: e.message})

}

})


//view addresses
router.get('/addresses', auth, async (req, res) =>{
    
    const user=await User.findById(req.user._id)

    //res.send(user.addresses)
    
    
    res.render('addresses', { title: 'Hey Idiot', message: 'Hello there!', addresses: user.addresses})
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
        user.addresses.splice(deleteIndex,1)
        await user.save()
 


        res.send(user.addresses)

    } catch (e) {


        res.sendStatus(500).render('newaddresserror', {error: e.message})
    }



})





router.get('/new_address', auth, async (req, res)=>{

    res.render('new_address')




})




module.exports=router