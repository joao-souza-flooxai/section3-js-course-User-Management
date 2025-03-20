class UserController{
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
        this.tableEl.innerHTML = ` 
                    <tr>
                        <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${dataUser.admin}</td>
                        <td>${dataUser.birth}</td>
                        <td>
                        <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                    </tr>
                  `;
    }

    onSubmit(){
        
        /*
            Caso não usassemos arrow functions, seria necessário guardar o escopo do objeto "this" antes de entrar no EventListener
            porque quando entramos lá, o escopo muda e o "this" passa a referir "formEl".
            
            let thisGlobal = this;  
        
        */

        /*
            Captura o Forms e adiciona uma rotina a ele. Nesse caso: para o fluxo normal com preventDefault
            e para cada campo no forms que tem um "name"(variavel fields) é introduzino um "User" por meio 
            do foreach(método getValues()). 
        */
        this.formEl.addEventListener("submit", (event)=>{
            event.preventDefault();

            let user = this.getValues();

            this.addLine(user)
    
        });

    }

    getValues(){

        let user = {};
        //Tratando os elements como array[] e usando o Spread para detonatar todos os elementos.
        [...this.formEl.elements].forEach((field)=>{
            if(field.name =="gender"){
                if(field.checked) user[field.name] = field.value;
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