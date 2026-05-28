// login.js — Conecta o formulário de login à API POST /auth/login

document.addEventListener('DOMContentLoaded', () => {
  const form     = document.querySelector('form');
  const msgErro  = document.getElementById('msg-erro');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[type="text"]').value.trim();
    const senha = form.querySelector('input[type="password"]').value;

    if (msgErro) msgErro.textContent = '';

    try {
      const res  = await fetch('/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, senha_pura: senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (msgErro) msgErro.textContent = data.error || 'Usuário ou senha incorretos.';
        return;
      }

      // Salva token e dados do usuário na sessionStorage
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('usuario', JSON.stringify(data.user));

      // Redireciona conforme função do funcionário
      const funcao = (data.user.funcao || '').toLowerCase();
      if (funcao.includes('gerente') || funcao.includes('admin')) {
        window.location.href = '/gerente/index.html';
      } else {
        window.location.href = '/home/index.html';
      }

    } catch (err) {
      if (msgErro) msgErro.textContent = 'Erro de conexão com o servidor.';
    }
  });
});
