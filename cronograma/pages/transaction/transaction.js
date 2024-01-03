if (!isNewTransaction()) {
    const uid = getTransactionUid();
    findTransactionByUid(uid);
}


function getTransactionUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid');
}

//Salvar ou cancelar função
function isNewTransaction() {
    return getTransactionUid() ? false : true;
}

//Editar os serviços cadastrados
function findTransactionByUid(uid) {
    showLoading();

    transactionService.findByUid(uid)
        .then(transaction => {
            hideLoading();
            if (transaction) {
                fillTransactionScreen(transaction);
            } else {
                alert("Documento nao encontrado");
                window.location.href = "../home/home.html";
            }
        })
        .catch(() => {
            hideLoading();
            alert("Erro ao recuperar documento");
            window.location.href = "../home/home.html";
        });

}

//Apresentar as linhas dos serviços
function fillTransactionScreen(transaction) {

    form.date().value = transaction.date;
    form.feito().value = transaction.feito;
    if (transaction.funcao) {
        form.funcao().value = transaction.funcao;
    }
    if (transaction.observacao) {
        form.observacao().value = transaction.observacao;
    }
}

//Salvar as informações do serviço
function saveTransaction() {
    const transaction = createTransaction();

    if (isNewTransaction()) {
        save(transaction);
    } else {
        update(transaction);
    }
}

//Apos salvar, ira cadastrar para tela de home
function save(transaction) {
    showLoading();

    transactionService.save(transaction)
        .then(() => {
            hideLoading();
            window.location.href = "../home/home.html";
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao salvar transaçao');
        })
}

//Atualizar o serviço
function update(transaction) {
    showLoading();
    transactionService.update(transaction)
        .then(() => {
            hideLoading();
            window.location.href = "../home/home.html";
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao atualizar transaçao');
        });
}


//Criar um novo serviço
function createTransaction() {
    return {
        date: form.date().value,
        observacao: form.observacao().value,
        funcao: form.funcao().value,
        feito: form.feito().value,
        user: {
            uid: firebase.auth().currentUser.uid
        }
    };
}

//Utilizar a data 
function onChangeDate() {
    const date = form.date().value;
    form.dateRequiredError().style.display = !date ? "block" : "none";

}


//formatação da data que veio do Home
function isFormValid() {
    const date = form.date().value;
    if (!date) {
        return false;
    }
    return true;
}


//Cancelar e retorna para tela de home
function cancelTransaction(){
    window.location.href = "../home/home.html"
}



const form = {
    date: () => document.getElementById('date'),
    funcao: () => document.getElementById('funcao'),
    observacao: () => document.getElementById('observacao'),
    dateRequiredError: () => document.getElementById('date-required-error'),
    saveButton: () => document.getElementById('save-button'),
    feito: () => document.getElementById('feito'),
}