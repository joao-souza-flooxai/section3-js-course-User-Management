class UserController{
    /*
        Constroi a classe pegando a referência ao Formulário e a Tabela Users,
        com as quais é necessário manipular os elementos e gerar uma relação 
        entre si. 
    */
    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEditCancel();
    }

    onEditCancel(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate();
        });
    }

    /*
        Método para adicionar novas linhas a table "Lista de Usuários" dinamicamente.
    */
    addLine(dataUser){
        /*
            Aqui, a instância da tag "tbody-table-users" é recuperada pelo id, e nela aplica-se o "InnerHTML" que insere outras 
            Tags dinamicamente conforme a Método "addLine(dataUser)" é chamada(quando um novo usuário é criado após o click do 
            botão "submit" no formulário).
        */
            let tr = document.createElement('tr');
            //Serializando o dataset(simulando um bd) para JSON string no element tr.
            tr.dataset.user = JSON.stringify(dataUser);
            console.log(tr.dataset.user);
            tr.innerHTML = `
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? 'Yes': 'No'}</td>
                <td>${Utils.dateFormat(dataUser.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `;

            tr.querySelector(".btn-edit").addEventListener("click", e=>{
                JSON.parse(tr.dataset.user);
                this.showPanelUpdate();
            
            });
            this.tableEl.appendChild(tr);
            this.updateCount();
    }

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector('#box-user-update').style.display = "none";
    }

    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector('#box-user-update').style.display = "block";
    }

    updateCount(){
        
        let numberUsers = 0;
        let numberAdmin = 0; 

        [...this.tableEl.children].forEach(tr =>{
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            //Por transformarmos o Objeto User para JSON, temos que pegar como está no JSON aqui, porque convertemos ele e está como _admin.
            if(user._admin)  numberAdmin++;
        });

        document.querySelector("#number-users").innerHTML = numberUsers;  
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;         
    }

    onSubmit(){
        
        /*
            Caso não usassemos arrow functions, seria necessário guardar o escopo do objeto "this" antes de entrar no EventListener
            porque quando entramos lá, o escopo muda e o "this" passa a referir "formEl".
            
            let thisGlobal = this;  
        
        */

        this.formEl.addEventListener("submit", (event)=>{
            
            event.preventDefault();

            let btnSubmit = this.formEl.querySelector("[type=submit]");
            btnSubmit.disable = true;
            let formValues = this.getValues();
            
            if(!formValues) return false
            //Chama a promise e executa o resolve ou reject com o .then.
            this.getPhoto().then(
                //Arrow Function usadas para não perder o contexto do this.
                (content)=>{
                    formValues.photo = content;
                    this.addLine(formValues);
                    this.formEl.reset();
                    btnSubmit.disable = false;
                },
                (e)=>{
                    console.error(e);
                }
            );
            
        });

    }

    /*
        Relação de onSubmit e getPhoto.
        Usuário submete o formulário ➝ onSubmit captura os valores do formulário.
        O metodo getPhoto retorna uma Promise contendo a foto construida pelo
        FileReader(onload, resolve) ou um erro(onerror,reject) e o onSubmit trata
        esse error com o then(então) que significa: "Quando terminar a Promise, então".
        Ali, duas funções podem ser chamadas dependendo do que acontece no getPhoto, já 
        que as funções esperam paramêtros iguais(content ou e), e as usam como assinatura.
    */

    getPhoto(){

        //Ao invés de fazer um callback, podemos executar usando Promise. Arrow Function usadas para não perder o contexto do this.
        return new Promise((resolve, reject)=>{
            //Instancica o objeto fileReader
            let fileReader = new FileReader();
            //Procura o elemento photo nos dados do formulário.
            let elements = [...this.formEl.elements].filter(item =>{
                if(item.name =='photo') return item;    
            });
            /*
                Captura o primeiro elemento no array elements(porque irá ser só 0 ou 1 elemento) 
                e 1 arquivo só(files[0]).
            */
            let file = elements[0].files[0];

            if(file){
                //Construindo
                fileReader.readAsDataURL(file);
                //Se der certo, chama-se o resolve
                fileReader.onload = () =>{
                    resolve(fileReader.result);
                };
                //Se der errado, chama-se o reject
                fileReader.onerror = (e) =>{
                    reject(e);
                };
            }else 
                //Se não houver imagem(file == null) resolva com um place holder;
                resolve('dist/img/boxed-bg.jpg');
            
        });

    }

    getValues(){

        let user = {};
        let isFormValid = true;
        //Tratando os elements como array[] e usando o Spread para detonatar todos os elementos.
        [...this.formEl.elements].forEach((field)=>{
            
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error');
                isFormValid = false;
            }

            if(field.name =="gender"){
                if(field.checked) user[field.name] = field.value;
            }
            else if(field.name =='admin'){
                user[field.name] = field.checked;
            }
            else{
                user[field.name] = field.value;
            }
        });

        if(!isFormValid) return false;

        return new User(
            user.name, 
            user.gender,
            user.birth, 
            user.country,
            user.email,
            user.admin                      
            );

    }
}