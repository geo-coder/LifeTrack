var xhttp = new XMLHttpRequest(); 


xhttp.onreadystatechange=function(){
    console.log(xhttp.readyState)
    if(xhttp.readyState===4){
        if (xhttp.status===200){
            
            const userAddressArray=JSON.parse(xhttp.responseText)
            
            console.log(userAddressArray)
            const existingAddresses=document.querySelector('.addresslist').children
            console.log('thing', existingAddresses)

            for(var x=0; x<userAddressArray.length; x++) {
                const addressItems=existingAddresses[x].children

                addressItems[0].textContent=userAddressArray[x].address.street
                addressItems[1].textContent=userAddressArray[x].address.city
                addressItems[2].textContent=userAddressArray[x].address.startDate
                addressItems[3].textContent=userAddressArray[x].address.endDate

                console.log(userAddressArray[x].address.street)
                
            }

            existingAddresses[existingAddresses.length-1].remove()
            
            //console.log(userAddressArray)
        } else {
            console.log('error')
        }
    }


}

document.querySelectorAll('.delete').forEach(item => {
    
    item.addEventListener('click', event => {
        //console.log('clicked', item.id)
        
        xhttp.open("DELETE", "/addresses/"+item.id, true);
        xhttp.send();
    })
})