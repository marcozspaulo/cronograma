//Validação de e-mail do banco de dados.
function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}