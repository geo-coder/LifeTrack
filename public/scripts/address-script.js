const clickAddressFunc = (event) =>{

    
    let addressArray=document.getElementsByClassName('address')

    for (var x=0;x<addressArray.length;x++){ //remove border from all addresses
        addressArray[x].style.borderStyle="none"              
         

    }
    
    
    
    let clickedItem=event.currentTarget

    clickedItem.style.borderStyle="solid"
    clickedItem.style.borderColor="black"

    document.getElementById('addressnotes').textContent=clickedItem.children[3].textContent //Adds the notes to the detail box
    document.getElementById('detailboxheading').textContent="Detail for " + clickedItem.children[0].textContent

    


}


const clickDelete = (event) =>{



    console.log(event.target.parentNode.id)
    const itemID=event.target.parentNode.id
    xhttp.open("DELETE", "/addresses/"+itemID, true); //removed item.id from here
    xhttp.send();




}




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
            
            
            
            
            
            
            
            
            const existingAddresses=document.querySelector('.addresslist').children
            
            
            var selectedIndex
            var selectedID
            for(var x=0; x<existingAddresses.length;x++){
                
                if (existingAddresses[x].style.borderStyle==='solid') {
                    selectedIndex=x
                    selectedID=existingAddresses[x].id
                    
                    
                    
                }
        
        
            }

            console.log(selectedIndex,selectedID)



            let itemIndex=this.itemIndex
            

            const userAddressArray=JSON.parse(xhttp.responseText)
            
            
            console.log('uder address array' , userAddressArray)
            

            if(userAddressArray.length>existingAddresses.length){
                console.log('adding routine')

                const extra=userAddressArray.length-existingAddresses.length

                for(var x=0;x<=extra;x++){
                    var element=document.createElement('div')
                    

                    document.getElementById('addresslist').appendChild(element)
                    

                    document.getElementById('addresslist').lastChild.className='address'
                    document.getElementById('addresslist').lastChild.innerHTML='<div></div><div></div><div></div><div style="display: none;"></div><div></div><a class="delete">Delete</a><a class="edit">Edit</a><br><br>'        
                    document.getElementById('addresslist').lastChild.addEventListener('click', clickAddressFunc)
                    
                    document.getElementById('addresslist').lastChild.children[5].addEventListener('click', clickDelete)


                    
                    
                    
                    


                    

                }
                

            }

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

            


            
            if (selectedIndex>=addressArray.length){
                selectedIndex=addressArray.length-1
            }

            
            for (var x=0;x<addressArray.length;x++){
                addressArray[x].style.borderStyle="none"
                             
                
                

            }

            for (var x=0;x<addressArray.length;x++){
                
                if(addressArray[x].id===selectedID){

                    
                    selectedIndex=x
                    
                }
                             
                
                

            }

            

            

            addressArray[selectedIndex].style.borderStyle="solid"
            addressArray[selectedIndex].style.borderColor="black"

            document.getElementById('addressnotes').textContent=addressArray[selectedIndex].children[3].textContent //Adds the notes to the detail box
            document.getElementById('detailboxheading').textContent="Detail for " + addressArray[selectedIndex].children[0].textContent

            
            





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
    document.getElementById('detailboxheading').textContent="Detail for " + firstAddress.children[0].textContent

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
        document.getElementById('detailboxheading').textContent="Detail for " + item.children[0].textContent
        
    })

    

})


document.getElementById('undo').addEventListener('click', ()=>{

    

    xhttp.open('GET', '/undo', true); //removed item.id from here
    xhttp.send();

})

