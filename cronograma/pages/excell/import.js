function handleFile(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Assuma que a primeira planilha será usada
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            // Converte a planilha para um array de objetos
            const transactions = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Certifique-se de que existem dados na planilha antes de chamar a função de importação
            if (transactions && transactions.length > 1) {
                console.log('Dados da planilha:', transactions);

                // Remove o cabeçalho da planilha (assumindo que o cabeçalho é a primeira linha)
                const header = transactions.shift();

                // Filtra as linhas não vazias
                const filteredTransactions = transactions.filter(row => row.length > 0);

                // Mapeia os dados para objetos usando o cabeçalho como chaves
                const transactionsObjects = filteredTransactions.map(row => {
                    const transaction = {};
                    row.forEach((value, index) => {
                        transaction[header[index]] = value;
                    });
                    return transaction;
                });

                // Chama a função de importação com os dados
                importExcel(transactionsObjects);
            } else {
                console.error('Nenhum dado encontrado na planilha ou planilha vazia.');
            }
        };

        reader.readAsArrayBuffer(file);
    }
}

function importExcel(transactions) {
    // Certifique-se de que 'transactions' é uma matriz definida
    if (Array.isArray(transactions)) {
        // Envie os dados para o Firebase Realtime Database
        transactions.forEach(transaction => {
            database.ref('transactions').push(transaction)
                .then(() => {
                    console.log('Dados importados com sucesso para o Firebase!');
                })
                .catch(error => {
                    console.error('Erro ao importar dados para o Firebase:', error);
                });
        });
    } else {
        console.error('Nenhum dado válido para importar.');
    }
}
