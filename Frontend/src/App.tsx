import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');

  async function handleLogin(e: any) {
    e.preventDefault(); // Impede a página de recarregar
    setErro('');

    try {
      // Faz a chamada para o seu Backend enviando 'senha'
      const response = await axios.post('http://localhost:3333/auth/login', {
        email,
        senha: password 
      });

      console.log('Login feito com sucesso!', response.data);
      alert('Login realizado com sucesso! ✅');

    } catch (err: any) {
      console.error("Erro retornado pelo Backend:", err.response?.data);
      
      // Captura o .error enviado pelo seu AuthController do Backend
      setErro(err.response?.data?.error || 'Erro ao tentar fazer login.');
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', fontFamily: 'sans-serif', color: '#fff' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px', background: '#222', padding: '30px', borderRadius: '8px' }}>
        <h2>Login - Sistema de Gestão</h2>
        
        {erro && <p style={{ color: '#ff4a4a', fontSize: '14px', margin: 0, fontWeight: 'bold' }}>{erro}</p>}

        <input 
          type="email" 
          placeholder="Seu e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
          required
        />

        <input 
          type="password" 
          placeholder="Sua senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
          required
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}