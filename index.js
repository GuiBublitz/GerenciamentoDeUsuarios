let inputName     = document.querySelector('#exampleInputName');
let gender        = document.querySelectorAll('#form-user-create [name=gender]:checked');
let inputBirth    = document.querySelector('#exampleInputBirth');
let selectCountry = document.querySelector('#exampleInputCountry');
let inputEmail    = document.querySelector('#exampleInputEmail');
let inputPassword = document.querySelector('#exampleInputPassword');
let inputPhoto    = document.querySelector('#exampleInputFile');
let chkAdmin      = document.querySelector('#exampleInputAdmin');

var fields =  document.querySelectorAll("#form-user-create [name]");

fields.forEach((field,index) => {
    if(field.name == 'gender' && field.checked) {
        console.log('Sim: '+ field.id);
    } else {
        console.log('Não');
    }
});