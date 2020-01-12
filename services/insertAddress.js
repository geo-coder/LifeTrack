

const insertAddress = async (user, req, res, fromRoute) =>{

    

    try {
    
        var dateEndDate
        if (req.body.toPresent) {
            dateEndDate = new Date()

        } else {
            dateEndDate=req.body.endDate
        }
        if(req.body.startDate>dateEndDate){
            throw new Error("Start date is later than end date.")
        }



        if(req.body.toPresent){req.body.endDate="present"}
        
        req.body.startDate=req.body.startDate.toString()
        req.body.endDate=req.body.endDate.toString()
        req.body.state=req.body.state.toUpperCase()

        if (!req.body.zip) {req.body.zip=''}

        
        
        user.addresses=user.addresses.concat({address: req.body})
        
        
        
        
        function compareDates(a,b) {
                
            var compStartDate1=new Date(a.address.startDate)
            var compStartDate2=new Date(b.address.startDate)
            
            return compStartDate2 - compStartDate1

        }
        user.addresses=user.addresses.sort(compareDates)
        
        
        
        
        


    
    await user.save()
    
    res.redirect('/addresses')
    
} catch (e) {
    
    console.log(e.message)
    //res.send({error: e.message})
    res.render('error', { message: e.message, goback:fromRoute})

}




}

module.exports=insertAddress