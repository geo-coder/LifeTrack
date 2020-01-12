const form=document.getElementById('changePWForm')

form.addEventListener('submit', (e)=>{

    e.preventDefault()
    const pw1=document.getElementById('pw1').value
    const pw2=document.getElementById('pw2').value

    if (pw1!==pw2) {
        alert('Passwords must match.')
    } else {

        form.submit()
    }



})