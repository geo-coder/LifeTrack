
function copy(){
    
    var text=document.querySelector('#textaddresses')
    text.select()
    document.execCommand('copy')
    
}

document.querySelector('#copytext').addEventListener('click', copy)