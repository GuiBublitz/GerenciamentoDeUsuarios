class UserController {

    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.initialize();
    }
    initialize(){
        this.onSubmit();
    }
    onSubmit(){
        this.formEl.addEventListener('submit', (e)=>{
            e.preventDefault();
            this.addUser(this.getValues());
        });   
    }
    getValues(){
        let user = {};
        [...this.formEl.elements].forEach((field,index) => {
            if(field.name == 'gender') {
                if(field.checked){
                    user[field.name] = field.value;   
                }
            } else {
                user[field.name] = field.value;
            }
        });
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    }
    addUser(userDate){
        this.tableEl.innerHTML +=  
        `
        <tr>
            <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
            <td>${userDate.name}</td>
            <td>${userDate.email}</td>
            <td>${userDate.admin}</td>
            <td>${userDate.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        </tr>
        `;
    }
}