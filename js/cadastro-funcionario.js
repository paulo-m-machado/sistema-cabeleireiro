// Máscara de Telefone (formato: (XX) XXXXX-XXXX)
const telefoneInput = document.getElementById('telefone');

telefoneInput.addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, ''); // Remove tudo o que não for dígito
    if (valor.length > 11) valor = valor.slice(0, 11);

    // Adiciona máscara gradativamente
    if (valor.length > 2) {
        valor = `(${valor.substring(0, 2)}) ` + valor.substring(2);
    }
    if (valor.length > 9) {
        valor = valor.substring(0, 10) + '-' + valor.substring(10);
    }

    e.target.value = valor;
});

// Validação de E-mail
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Manipulando o Formulario
const form = document.getElementById('form-cadastro-funcionario');
const btnCancelar = document.getElementById('btn-cancelar');
const btnSalvar = document.getElementById('btn-salvar');
const mensagemSucesso = document.getElementById('mensagem-sucesso');
const erroEmail = document.getElementById('erro-email');

// Ação de Salvar (Apertando Submit do form)
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio real do formulário (recarregar página)

    const email = document.getElementById('emailContato').value;

    // Verificação adicional de E-mail
    if (!validarEmail(email)) {
        erroEmail.style.display = 'block';
        return; // Retorna e não salva
    } else {
        erroEmail.style.display = 'none';
    }

    // Como os inputs obrigatórios já possuem o atributo `required`,
    // o próprio HTML5 cuida do aviso caso estejam vazios.

    // Exibe sucesso!
    mensagemSucesso.style.display = 'block';
    
    // Esconde a mensagem após 3 segundos
    setTimeout(() => {
        mensagemSucesso.style.display = 'none';
    }, 3000);

    // Limpa os campos
    form.reset();
});

// Ação do Botão Cancelar
btnCancelar.addEventListener('click', function () {
    // Opção 1: Limpar os campos
    form.reset();
    mensagemSucesso.style.display = 'none';
    erroEmail.style.display = 'none';
    
    // Opção 2: Redirecionar para home ou tela de consulta (descomente caso queira redirecionar)
    // window.location.href = '/home/index.html';
});
