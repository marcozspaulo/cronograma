
//Sair do usuario
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

//Verificar usuario
firebase.auth().onAuthStateChanged(user => {
    if (user){
        findTransactions(user);
    }
})

//Novo cadastro de serviço
function newTransaction() {
    window.location.href = "../transaction/transaction.html";
}

//Pegar as informações do banco
function findTransactions(user) {
    showLoading();
    transactionService.findByUser(user)
        .then(transactions => {
            hideLoading();
            addTransactionsToScreen(transactions);
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao recuperar transacoes');
        })
}


//Adcionar as informações no banco
function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById('transactions');

    transactions.forEach(transaction => {
        const li = createTransactionListItem(transaction);
        li.appendChild(createDeleteButton(transaction));

        li.appendChild(createParagraph(formatDate(transaction.date)));

        if (transaction.feito) {
            li.appendChild(createParagraph(transaction.feito));
        }
      
        if (transaction.funcao) {
            li.appendChild(createParagraph(transaction.funcao));
        }
        if (transaction.observacao) {
            li.appendChild(createParagraph(transaction.observacao));
        }

        orderedList.appendChild(li);
    });
}

//Criar linhas no banco
function createParagraph(value) {
    const element = document.createElement('p');
    element.innerHTML = value;
    return element;
}

//Ir para tela de cadastrar serviço
function createTransactionListItem(transaction) {
    
    const li = document.createElement('li');
    li.id = transaction.uid;
    li.addEventListener('click', () => {
        window.location.href = "../transaction/transaction.html?uid=" + transaction.uid;
    })
    return li;
}

//Deletar um serviço
function createDeleteButton(transaction) {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = "Remover";
    deleteButton.classList.add('outline', 'danger');
    deleteButton.addEventListener('click', event => {
        event.stopPropagation();
        askRemoveTransaction(transaction);
    })
    return deleteButton;
}

//Realiza a pergunta antes de excluir a transação
function askRemoveTransaction(transaction) {
    const shouldRemove = confirm('Deseja remover a transaçao?');
    if (shouldRemove) {
        removeTransaction(transaction);
    }
}

//Excluir uma serviço
function removeTransaction(transaction) {
    showLoading();

    transactionService.remove(transaction)
        .then(() => {
            hideLoading();
            document.getElementById(transaction.uid).remove();
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao remover transaçao');
        })
}

//Gerar a data formatação Brasil
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br', { timeZone: 'UTC' });
}

// Para fazer os botôes da semana funcionar
const daysOfWeekButtons = document.querySelectorAll('.day-of-week-button');
daysOfWeekButtons.forEach(button => {
    button.addEventListener('click', function() {
        const dayOfWeek = parseInt(this.dataset.dayOfWeek, 10);
        showTransactionsOnDayOfWeek(dayOfWeek);
    });
});

// Função  para mostrar transações em um dia específico da semana
function showTransactionsOnDayOfWeek(dayOfWeek) {
    const orderedList = document.getElementById('transactions');
    orderedList.innerHTML = ''; // Limpar a lista antes de adicionar as transações

    const user = firebase.auth().currentUser;

    if (!user) {
        console.error("Usuário não autenticado");
        return;
    }

    transactionService.findByUser(user)
        .then(transactions => {
            const transactionsOnDayOfWeek = transactions.filter(transaction => isDayOfWeek(transaction.date, dayOfWeek));
            addTransactionsToScreen(transactionsOnDayOfWeek);
        })
        .catch(error => {
            console.log(error);
            alert('Erro ao recuperar transacoes');
        });
}

// Função para verificar se uma data corresponde a um determinado dia da semana
function isDayOfWeek(date, targetDayOfWeek) {
    if (!date) {
        console.log("Data indefinida");
        return false; // Se a data for indefinida, não corresponde a nenhum dia da semana
    }

    const data = new Date(date);
    
    // Comparar apenas ano, mês e dia
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - targetDate.getDay() + targetDayOfWeek);
    
    return (
        data.getFullYear() === targetDate.getFullYear() &&
        data.getMonth() === targetDate.getMonth() &&
        data.getDate() === targetDate.getDate()
    );
}


