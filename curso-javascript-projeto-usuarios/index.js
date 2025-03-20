//Pegando as variáveis usando variavel de escopo global
var name = document.querySelector("#exampleInputName");
var gender = document.querySelectorAll("#form-user-create [name=gender]:checked"); 
var birth = document.querySelector("#exampleInputBirth");
var country = document.querySelector("#exampleInputCountry"); 
var email = document.querySelector("#exampleInputEmail");
var password = document.querySelector( "#exampleInputPassword"); 
var photo = document.querySelector("#exampleInputFile");
var admin = document.querySelector("exampleInputAdmin");

//Pegando as variáveis dinamicamente usando variavel de escopo global
var fields = document.querySelectorAll("#form-user-create [name]");
var user = {};

document.querySelectorAll("button").forEach(()=>{
    this.addEventListener("click", ()=>{
        console.log("Adicionou EventListener em todos as tags botões.");
    });
});

/*
    Função para adicionar novas linhas a table "Lista de Usuários" dinamicamente.
*/
function addLine(dataUser){
    /*
        Aqui, a instância da tag "tbody-table-users" é recuperada pelo id, e nela aplica-se o "InnerHTML" que insere outras 
        Tags dinamicamente conforme a função "addLine(dataUser)" é chamada(quando um novo usuário é criado após o click do 
        botão "submit" no formulário).
    */
    document.getElementById("tbody-table-users").innerHTML = ` 
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

/*
    Captura o Forms e adiciona uma rotina a ele. Nesse caso: para o fluxo normal com preventDefault, mostra um alert, console.log
    e para cada campo no forms que tem um "name"(variavel fields) é introduzino no Json "user" for meio do foreach. 
*/
document.getElementById("form-user-create").addEventListener("submit", (event)=>{
   event.preventDefault();
   alert('Você clicou no botão submit!!');
   console.log("Agora é possivel ver o console porque o preventDefault foi colocado evitando que o envio do forms atualize a página.");
    
   fields.forEach(function(field, index){
        if(field.name =="gender"){
            if(field.checked) user[field.name] = field.value;
        }
        else{
            user[field.name] = field.value;
        }
        //console.log(field, index);
    });

    addLine(user);
    console.log(user);

});

var json = {name:"João", age:"12"};
