const myform = document.getElementById('newUserForm')


const questionLabel=document.getElementById('questionLabel')

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const randomIndex=Math.floor(Math.random()*26)
const randomLetter=alphabet.charAt(randomIndex)



questionLabel.textContent="Please type the letter '" + randomLetter + "' in upper case: "






myform.addEventListener('submit', (e)=>{

    e.preventDefault()
    const pw1=document.getElementById('password').value
    const pw2=document.getElementById('pw2').value
    const answer=document.getElementById('question').value
    //const email=document.getElementById('email').value
    // const firstName=document.getElementById('firstName').value
    // const lastName=document.getElementById('lastName').value
    
    

    if (pw1!==pw2){
        alert('Passwords do not match.')
    } else if (answer!==randomLetter.toUpperCase()){
        alert('Invalid answer to question.')



    } else {

        myform.submit()
    }
    
    
    
    
    


})

    
