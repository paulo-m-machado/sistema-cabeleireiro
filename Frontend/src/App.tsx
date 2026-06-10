import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }         from './context/AuthContext';
import { Navbar }               from './components/Navbar';
import { ProtectedRoute }       from './components/ProtectedRoute';
import { Login }                from './pages/Login/Login';
import { Home }                 from './pages/Home/Home';
import { Cadastro }             from './pages/Cadastro/Cadastro';
import { Servicos }             from './pages/Servicos/Servicos';
import { Agendamento }          from './pages/Agendamento/Agendamento';
import { Agenda }               from './pages/Agenda/Agenda';
import { HistoricoCliente }     from './pages/HistoricoCliente/HistoricoCliente';
import { CadastroFuncionario }  from './pages/CadastroFuncionario/CadastroFuncionario';
import { Estoque }              from './pages/Estoque/Estoque';
import { Vendas }               from './pages/Vendas/Vendas';
import { Gerente }              from './pages/Gerente/Gerente';
import { Equipe }               from './pages/Equipe/Equipe';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <header>
          <Navbar />
        </header>

        <Routes>
          {/* Públicas */}
          <Route path="/"            element={<Home />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/cadastro"    element={<Cadastro />} />
          <Route path="/servicos"    element={<Servicos />} />
          <Route path="/agendamento" element={<Agendamento />} />

          {/* Requerem login */}
          <Route path="/agenda" element={
            <ProtectedRoute><Agenda /></ProtectedRoute>
          } />
          <Route path="/vendas" element={
            <ProtectedRoute><Vendas /></ProtectedRoute>
          } />
          <Route path="/historico-cliente" element={
            <ProtectedRoute><HistoricoCliente /></ProtectedRoute>
          } />

          {/* Requerem gerente */}
          <Route path="/cadastro-funcionario" element={
            <ProtectedRoute requireGerente><CadastroFuncionario /></ProtectedRoute>
          } />
          <Route path="/equipe" element={
            <ProtectedRoute requireGerente><Equipe /></ProtectedRoute>
          } />
          <Route path="/estoque" element={
            <ProtectedRoute requireGerente><Estoque /></ProtectedRoute>
          } />
          <Route path="/gerente" element={
            <ProtectedRoute requireGerente><Gerente /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}