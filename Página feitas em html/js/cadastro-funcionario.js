// cadastro-funcionario.js — Conecta o formulário à API POST /funcionarios

// Máscara de telefone
const telefoneInput = document.getElementById('telefone');
if (telefoneInput) {
  telefoneInput.addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 2)  v = `(${v.substring(0, 2)}) ` + v.substring(2);
    if (v.length > 10) v = v.substring(0, 10) + '-' + v.substring(10);
    e.target.value = v;
  });
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const form           = document.getElementById('form-cadastro-funcionario');
const btnCancelar    = document.getElementById('btn-cancelar');
const mensagemSucesso = document.getElementById('mensagem-sucesso');
const erroEmail      = document.getElementById('erro-email');
const msgErroGeral   = document.getElementById('msg-erro-geral');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('emailContato').value.trim();

    if (erroEmail)    erroEmail.style.display    = 'none';
    if (msgErroGeral) msgErroGeral.textContent   = '';

    if (!validarEmail(email)) {
      if (erroEmail) erroEmail.style.display = 'block';
      return;
    }

    const payload = {
      nome:            document.getElementById('nomeCompleto')?.value.trim(),
      cpf:             document.getElementById('cpf')?.value.trim(),
      data_nascimento: document.getElementById('dataNascimento')?.value || null,
      contato:         telefoneInput?.value.trim(),
      email,
      senha:           document.getElementById('senha')?.value || '123456',
      funcao:          document.getElementById('funcao')?.value.trim(),
      endereco:        document.getElementById('endereco')?.value.trim(),
      disponibilidade: document.getElementById('disponibilidade')?.value.trim(),
    };

    try {
      const token = sessionStorage.getItem('token');
      const res   = await fetch('/funcionarios', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (msgErroGeral) msgErroGeral.textContent = data.error || 'Erro ao cadastrar funcionário.';
        return;
      }

      if (mensagemSucesso) {
        mensagemSucesso.style.display = 'block';
        setTimeout(() => { mensagemSucesso.style.display = 'none'; }, 3000);
      }

      form.reset();

    } catch (err) {
      if (msgErroGeral) msgErroGeral.textContent = 'Erro de conexão com o servidor.';
    }
  });
}

if (btnCancelar) {
  btnCancelar.addEventListener('click', () => {
    form?.reset();
    if (mensagemSucesso) mensagemSucesso.style.display = 'none';
    if (erroEmail)       erroEmail.style.display       = 'none';
    if (msgErroGeral)    msgErroGeral.textContent       = '';
  });
}
