document.getElementById('deleteProfile').addEventListener('click', ()=>{
    

    if (window.confirm("Are you sure you want to permanently delete your account?")) { 
        
      window.location.replace('/delete_profile')
        
    }
    
})