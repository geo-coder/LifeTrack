const myform = document.getElementById('newUserForm')


myform.addEventListener('submit', (e)=>{

    e.preventDefault()
    const pw1=document.getElementById('password').value
    const pw2=document.getElementById('pw2').value
    const email=document.getElementById('email').value
    // const firstName=document.getElementById('firstName').value
    // const lastName=document.getElementById('lastName').value
    
    console.log(pw1, pw2)

    if (pw1!==pw2){
        alert('Passwords do not match.')
    } else if (email==='') {
        alert('An email address must be provided.')
    } else {

        myform.submit()
    }
    
    
    
    
    


})

    
