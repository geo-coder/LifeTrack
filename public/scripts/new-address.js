
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



document.getElementById('dummyDataButton').addEventListener('click', (e) =>{

    
    const dummyAddressNumber = Math.floor(1000 * Math.random())
    const dummyAddressStreets = ["Pluto Lane", "Saturn Street", "Quasar Terrace", "Megatron Drive", "MilkyWay Lane", "Mercury Street", "Zeus Lane", "Cider Road", "Starry Turnpike", "Crestwood Street", "Brontosaurus Way"]
    const dummyAddressStreet = dummyAddressStreets[Math.floor(Math.random()*dummyAddressStreets.length)]
    const dummyCities=["Faketown", "Xanadu", "Quinceland", "Dryspell", "Clearriver", "Smithtown", "Hartfield", "Smithfield"]
    const dummyCity=dummyCities[Math.floor(Math.random()*dummyCities.length)]
    const states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ]
    const dummyState=states[Math.floor(Math.random()*states.length)]
    


    document.getElementById('addressLineOne').value=dummyAddressNumber + ' ' + dummyAddressStreet
    document.getElementById('unitNo').value='Unit ' + Math.floor(Math.random()*30)
    document.getElementById('city').value=dummyCity
    document.getElementById('state').value=dummyState
    document.getElementById('zip').value=Math.floor(Math.random() * 90000) + 10000
    e.preventDefault()

})
