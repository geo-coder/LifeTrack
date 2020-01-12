
const zeroAddressCheck =()=>{ // if there are 0 addresses, hide the notes detail box on right
    
    if (document.getElementsByClassName('address').length===0 || document.querySelector('.addresslist').children===0){
        document.getElementById('dispbox').style.visibility='hidden'
    } else if (document.getElementsByClassName('address').length>0){
        document.getElementById('dispbox').style.visibility='visible'
    }

    

}



zeroAddressCheck()

var xhttp = new XMLHttpRequest(); 




xhttp.onreadystatechange=function(){
    
    
    
    if(xhttp.readyState===4){
        
        if (xhttp.status===200){
            
            
            
            
            
            //var selectedAddress=findSelected()
            
            
            const existingAddresses=document.querySelector('.addresslist').children
            
            
            var selectedIndex
            var selectedID
            for(var x=0; x<existingAddresses.length;x++){
                
                if (existingAddresses[x].style.borderStyle==='solid') {
                    selectedIndex=x
                    selectedID=existingAddresses[x].id
                    
                    
                    
                }
        
        
            }

            



            let itemIndex=this.itemIndex
            

            const userAddressArray=JSON.parse(xhttp.responseText)
            
            
            
            

            

            for(var x=0; x<userAddressArray.length; x++) {
                
                existingAddresses[x].id=userAddressArray[x]._id //refresshes id of each div to id of respective address record
                const addressItems=existingAddresses[x].children

                
                
                addressItems[0].textContent=userAddressArray[x].address.addressLineOne
                addressItems[1].textContent=userAddressArray[x].address.unitNo
                addressItems[2].textContent=userAddressArray[x].address.city + ', ' + userAddressArray[x].address.state + ' ' + userAddressArray[x].address.zip
                addressItems[3].textContent=userAddressArray[x].address.notes
                addressItems[4].textContent=userAddressArray[x].address.formattedStart + " to " + userAddressArray[x].address.formattedEnd
                



                
            }

            existingAddresses[existingAddresses.length-1].remove()
            

            let addressArray=document.getElementsByClassName('address')

            zeroAddressCheck()
            // if(itemIndex===addressArray.length){
            //     for (var x=0;x<addressArray.length;x++){

            //         addressArray[x].style.borderStyle="none"


            //     }
            //     document.getElementById('addressnotes').textContent=''
            //     document.getElementById('detailboxheading').innerHTML=''
            //     zeroAddressCheck()

            // } else {
                
            //     for (var x=0;x<addressArray.length;x++){

            //         addressArray[x].style.borderStyle="none"


            //     }

            //     addressArray[itemIndex].style.borderStyle="solid"
            //     addressArray[itemIndex].style.borderColor="black"
                
            //     document.getElementById('addressnotes').textContent=addressArray[itemIndex].children[3].textContent //Adds the notes to the detail box
            //     document.getElementById('detailboxheading').innerHTML="Detail for " + addressArray[itemIndex].children[0].textContent
            //     zeroAddressCheck()
                

            // }

            


            
            if (selectedIndex>addressArray.length){
                selectedIndex=addressArray.length-1
            }

            
            for (var x=0;x<addressArray.length;x++){
                addressArray[x].style.borderStyle="none"
                             
                
                

            }



            addressArray[0].style.borderStyle="solid"
            addressArray[0].style.borderColor="black"

            document.getElementById('addressnotes').textContent=addressArray[0].children[3].textContent //Adds the notes to the detail box
            document.getElementById('detailboxheading').innerHTML="Detail for " + addressArray[0].children[0].textContent

            
            





        } else {
            console.log('error')
        }
    }


}



document.querySelectorAll('.delete').forEach(item => {
    

    
    item.addEventListener('click', event => {
        
        
        
        
        let addressArray=document.getElementsByClassName('address')
        let itemIndex
        
        
        
        
        for (var x=0;x<addressArray.length;x++){ //gets the index of the clicked item
            if (item.parentNode.id===addressArray[x].id){
                itemIndex=x
                break
            }
        }
        
        
        
        
        
        
        
        xhttp.itemIndex=itemIndex

        xhttp.open("DELETE", "/addresses/"+item.parentNode.id, true); //removed item.id from here
        xhttp.send();

        


        
        

    })
})

document.querySelectorAll('.edit').forEach(item => {
    
    item.addEventListener('click', event => {
        
        
        window.location.replace('http://localhost:3000/edit_address/'+item.parentNode.id)
        

    })
})


if(document.querySelectorAll('.address').length>0){ //on page load, select first address card
    
    var firstAddress=document.querySelectorAll('.address')[0]
    
    firstAddress.style.borderStyle='solid'
    firstAddress.style.borderColor='black'
    document.getElementById('addressnotes').textContent=firstAddress.children[3].textContent //Adds the notes to the detail box
    document.getElementById('detailboxheading').innerHTML="Detail for " + firstAddress.children[0].textContent

}



document.querySelectorAll('.address').forEach(item=>{
    
    
    
    
    
    item.addEventListener('click', event=>{

        console.log(event.target.className)
        if(event.target.className==='delete') {return}

        document.querySelectorAll('.address').forEach(item=>{
            item.style.borderStyle="none"
        })
        item.style.borderStyle='solid'
        item.style.borderColor='black'
        
        
        document.getElementById('addressnotes').textContent=item.children[3].textContent //Adds the notes to the detail box
        document.getElementById('detailboxheading').innerHTML="Detail for " + item.children[0].textContent
        
    })

    

})

