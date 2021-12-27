var fields =  document.querySelectorAll("#form-user-create [name]");
var user = {};
document.getElementById('form-user-create').addEventListener('submit',(e)=>{
    e.preventDefault();
    fields.forEach((field,index) => {
        if(field.name == 'gender') {
            if(field.checked){
                user[field.name] = field.value;   
            }
        } else {
            user[field.name] = field.value;
        }
    });
    console.log(user);
});
