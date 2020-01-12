
document.getElementById('toPresent').addEventListener('change', ()=>{

    if(document.getElementById('toPresent').checked){
        document.getElementById('endDate').value=''
    }
    
        
    
})


document.getElementById('endDate').addEventListener('change', ()=>{

    document.getElementById('toPresent').checked=false
    
        
    
})

const form=document.getElementById('address_form')
form.addEventListener('submit', (e)=>{

     
   if(!document.getElementById('toPresent').checked){

        e.preventDefault()
        const startDate=document.getElementById('startDate').value
        const endDate=document.getElementById('endDate').value
        
        if(startDate>endDate) {

            alert('Start date is later than end date.')


        } else{
            form.submit()
        }


   }
})
