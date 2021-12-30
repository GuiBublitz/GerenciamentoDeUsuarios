class UserController {
    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.panelCreate = document.getElementById('box-user-create');
        this.panelUpdate = document.getElementById('box-user-update');       
        this.initialize();
    }
    initialize(){
        this.onSubmit();
        this.onEditEvents();
    }
    onEditEvents(){ 
        document.querySelector("#box-user-update .btn-cancel").addEventListener('click',()=>{
            this.showPanelCreate();
        });
    }
    onSubmit(){
        this.formEl.addEventListener('submit', (e)=>{
            e.preventDefault();
            let btn = this.formEl.querySelector('[type=submit]');
            btn.disabled = true;
            let values = this.getValues();
            if(!values){
                btn.disabled = false;
                console.error('Digita os dadu antes né sua anta')
                return false;
            }
            this.getPhoto().then(
                (content)=>{
                    values.photo = content;
                    this.addUser(values);
                    btn.disabled = false;
                    this.formEl.reset();
                },
                (e)=>{
                    console.error(e);   
                }
            );                      
        });   
    }
    getPhoto(){
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            let elements = [...this.formEl.elements].filter( (item) => {
                if (item.name === 'photo'){
                    return item;
                }
            });
            let file = elements[0].files[0];
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (e) => {
                reject(e);
            };
            if(file){
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }
        })
    }
    getValues(){
        let user = {};
        let isValid = true;
        [...this.formEl.elements].forEach((field,index) => {
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error');
                isValid = false;
            }
            if(field.name == 'gender') {
                if(field.checked){
                    user[field.name] = field.value;   
                }
            }else if(field.name == 'admin'){
                user[field.name] = field.checked;
            }else{
                user[field.name] = field.value;
            }
        });
        if(!isValid){
            return false;
        }
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
    addUser(userData){
        let tr = document.createElement('tr');
        tr.dataset.user = JSON.stringify(userData);
        tr.innerHTML =`
            <td><img src="${userData.photo}" alt="User Image" style="object-fit: cover" class="img-circle img-sm"></td>
            <td>${userData.name}</td>
            <td>${userData.email}</td>
            <td>${(userData.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(userData.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
        tr.querySelector('.btn-edit').addEventListener('click',(e)=>{
            console.log(JSON.parse(tr.dataset.user));
            this.showPanelUpdate();
        });
        this.tableEl.appendChild(tr);
        this.updateCount();
    }
    showPanelCreate(){
        this.panelCreate.style.display = "block";   
        this.panelUpdate.style.display = "none";   
    }
    showPanelUpdate(){
        this.panelCreate.style.display = "none";   
        this.panelUpdate.style.display = "block";     
    }
    updateCount(){
        let numberUsers = 0;
        let numberAdmin = 0;
        
        [...this.tableEl.children].forEach((item)=>{
            let user = JSON.parse(item.dataset.user);
            if(user._admin){
                numberAdmin++;
            }else{
                numberUsers++;
                
            }
        });
        document.getElementById('number-users-admin').textContent = numberAdmin;
        document.getElementById('number-users').textContent = numberUsers;
    }
}