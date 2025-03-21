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
            let tr = document.createElement("tr");

            tr.innerHTML = `
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? 'Yes': 'No'}</td>
                <td>${dataUser.birth}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `;
        
            this.tableEl.appendChild(tr);
    }

    onSubmit(){
        
        /*
            Caso não usassemos arrow functions, seria necessário guardar o escopo do objeto "this" antes de entrar no EventListener
            porque quando entramos lá, o escopo muda e o "this" passa a referir "formEl".
            
            let thisGlobal = this;  
        
        */

        this.formEl.addEventListener("submit", (event)=>{
            
            event.preventDefault();
            let formValues = this.getValues();
            
            //Chama a promise e executa o resolve ou reject com o .then.
            this.getPhoto().then(
                //Arrow Function usadas para não perder o contexto do this.
                (content)=>{
                    formValues.photo = content;
                    this.addLine(formValues);
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
        //Tratando os elements como array[] e usando o Spread para detonatar todos os elementos.
        [...this.formEl.elements].forEach((field)=>{
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