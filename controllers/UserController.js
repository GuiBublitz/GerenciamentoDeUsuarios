class UserController {
    constructor(formCreateId, formUpdateId, tableId){
        this.formEl = document.getElementById(formCreateId);
        this.formElUpdate = document.getElementById(formUpdateId);
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
        this.formElUpdate.addEventListener('submit', (e)=>{
            e.preventDefault();
            let btn = this.formElUpdate.querySelector('[type=submit]');
            btn.disabled = true;
            let values = this.getValues(this.formElUpdate);
            let index = this.formElUpdate.dataset.trIndex;
            let tr = this.tableEl.rows[index];
            let userOld = JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, values);
            this.getPhoto(this.formElUpdate).then(
                (content)=>{
                    if(!values.photo){
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }
                    tr.dataset.user = JSON.stringify(result);
                    tr.innerHTML =`
                        <td><img src="${result._photo}" alt="User Image" style="object-fit: cover" class="img-circle img-sm"></td>
                        <td>${result._name}</td>
                        <td>${result._email}</td>
                        <td>${(result._admin) ? 'Sim' : 'Não'}</td>
                        <td>${Utils.dateFormat(result._register)}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                    `;
                    this.addEventsTr(tr);
                    this.updateCount();
                    this.formElUpdate.reset();
                    this.showPanelCreate();
                    btn.disabled = false;
                },
                (e)=>{
                    console.error(e);   
                }
            );
        });
    }
    onSubmit(){
        this.formEl.addEventListener('submit', (e)=>{
            e.preventDefault();
            let btn = this.formEl.querySelector('[type=submit]');
            btn.disabled = true;
            let values = this.getValues(this.formEl);
            // console.log(values);
            if(!values){
                btn.disabled = false;
                console.error('Digita os dadu antes né sua anta')
                return false;
            }
            this.getPhoto(this.formEl).then(
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
    getPhoto(form){
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            let elements = [...form.elements].filter( (item) => {
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
    getValues(form){
        let user = {};
        let isValid = true;
        [...form.elements].forEach((field,index) => {
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
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;
        this.addEventsTr(tr);
        this.tableEl.appendChild(tr);
        this.updateCount();
    }
    addEventsTr(tr){
        tr.querySelector('.btn-delete').addEventListener('click',(e)=>{
            if(confirm("Deseja realmente excluir?")){
                tr.remove();
                this.updateCount();
            }
        });
        tr.querySelector('.btn-edit').addEventListener('click',(e)=>{
            let json = JSON.parse(tr.dataset.user);
            this.formElUpdate.dataset.trIndex = tr.sectionRowIndex;
            for(let name in json){
                let field = this.formElUpdate.querySelector("[name="+name.replace('_','')+"]");
                if(field){
                    switch (field.type){
                        case 'file':
                            continue;
                            break;
                        case 'radio': 
                            this.formElUpdate.querySelector('[name='+name.replace('_','') +'][value='+ json[name] +']').checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }
                }
            };
            this.formElUpdate.querySelector(".photo").src = json._photo;
            this.showPanelUpdate();
        });
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
                numberUsers++;  
            }else{
                numberUsers++;   
            }
        });
        document.getElementById('number-users-admin').textContent = numberAdmin;
        document.getElementById('number-users').textContent = numberUsers;
    }
}