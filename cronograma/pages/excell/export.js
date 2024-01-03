document.getElementById('exportButton').addEventListener('click', exportToExcel);

function exportToExcel() {
    const user = firebase.auth().currentUser;

    if (!user) {
        console.error("Usuário não autenticado");
        return;
    }

    transactionService.findByUser(user)
        .then(transactions => {
            if (transactions.length > 0) {
                // Chama a função para criar o arquivo Excel
                exportTransactionsToExcel(transactions);
            } else {
                alert("Não há transações para exportar.");
            }
        })
        .catch(error => {
            console.log(error);
            alert('Erro ao recuperar transacoes');
        });
}




function exportTransactionsToExcel(transactions) {
    // Criar uma planilha
    const wb = XLSX.utils.book_new();

    // Criar uma folha de cálculo
    const ws = XLSX.utils.json_to_sheet(transactions);

    // Adicionar a folha de cálculo à planilha
    XLSX.utils.book_append_sheet(wb, ws, 'Transações');

    // Criar um blob a partir da planilha
    const blob = new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', mimeType: 'application/octet-stream', type: 'binary' }))], { type: 'application/octet-stream' });

    // Criar um link para download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transacoes.xlsx';

    // Adicionar o link ao corpo do documento
    document.body.appendChild(link);

    // Clicar no link para iniciar o download
    link.click();

    // Remover o link do corpo do documento
    document.body.removeChild(link);
}

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}