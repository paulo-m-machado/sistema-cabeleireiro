// ==========================================
// DADOS FALSOS PARA SIMULAR O BANCO DE DADOS
// ==========================================
const mockClientes = {
    "123": { nome: "Maria Joaquina", telefone: "(11) 98765-4321", alergias: "PPD (presente em algumas tinturas)" },
    "456": { nome: "Carlos Eduardo", telefone: "(11) 91234-5678", alergias: "Nenhuma" },
};

let historicoMock = [
    {
        id: "reg-1",
        codCliente: "123",
        data: "2026-03-10",
        profissional: "Ana (Colorimetrista)",
        tipoServico: "Retoque de Raiz e Hidratação",
        produtos: "Shampoo L'Oréal, Máscara Joico",
        marcaTinta: "Wella Color Touch",
        formula: "6.0 com emulsão 4%",
        tempoPausa: "30",
        corte: "Manutenção de pontas",
        preferencias: "Água morna/fria para lavar",
        observacoes: "Cabelo apresentou leve ressecamento nas pontas. Indicado cronograma capilar.",
        recomendacao: "Retornar em 15 dias para reconstrução"
    }
];

// ==========================================
// ELEMENTOS DO DOM
// ==========================================
const btnPesquisar = document.getElementById('btnPesquisar');
const inputPesquisa = document.getElementById('pesquisaCliente');

const perfilCliente = document.getElementById('perfilCliente');
const nomeClienteDisplay = document.getElementById('nomeClienteDisplay');
const telefoneClienteDisplay = document.getElementById('telefoneClienteDisplay');
const alergiasDisplay = document.getElementById('alergiasDisplay');

const listaHistorico = document.getElementById('listaHistorico');
const btnNovoRegistro = document.getElementById('btnNovoRegistro');

const modalRegistro = document.getElementById('modalRegistro');
const formHistorico = document.getElementById('formHistorico');
const btnCancelarRegistro = document.getElementById('btnCancelarRegistro');
const closeBtn = document.querySelector('.close-modal');

let clienteAtual = null;

// ==========================================
// FUNÇÕES DE EXIBIÇÃO E PESQUISA
// ==========================================

btnPesquisar.addEventListener('click', () => {
    const termo = inputPesquisa.value.trim().toLowerCase();
    
    // Procura no mock (simulando busca no BD por código ou nome simplificado)
    let clienteEncontrado = null;
    let codEncontrado = null;
    
    for (const [cod, dados] of Object.entries(mockClientes)) {
        if(cod === termo || dados.nome.toLowerCase().includes(termo) || dados.telefone.includes(termo)) {
            clienteEncontrado = dados;
            codEncontrado = cod;
            break;
        }
    }

    if (clienteEncontrado) {
        clienteAtual = codEncontrado;
        nomeClienteDisplay.innerText = clienteEncontrado.nome;
        telefoneClienteDisplay.innerText = clienteEncontrado.telefone;
        alergiasDisplay.innerText = clienteEncontrado.alergias;

        perfilCliente.style.display = 'flex';
        renderizarCards(codEncontrado);
    } else {
        alert("Cliente não encontrado. Tente buscar por 'Maria' ou pelo código '123'.");
        perfilCliente.style.display = 'none';
        listaHistorico.innerHTML = `<div class="historico-card placeholder-card">
            <p style="text-align:center; color: #888;">Nenhum cliente para exibir.</p>
        </div>`;
    }
});

function renderizarCards(codCliente) {
    listaHistorico.innerHTML = '';
    
    // Filtra histórico do cliente atual e ordena por data (mais recente primeiro)
    const registros = historicoMock
        .filter(reg => reg.codCliente === codCliente)
        .sort((a,b) => new Date(b.data) - new Date(a.data));

    if (registros.length === 0) {
        listaHistorico.innerHTML = `<p style="text-align:center; padding: 20px;">Nenhum histórico registrado para este cliente.</p>`;
        return;
    }

    registros.forEach(reg => {
        // Formata data de YYYY-MM-DD para DD/MM/YYYY
        let dataStr = "";
        if(reg.data) {
            const partes = reg.data.split('-');
            if(partes.length === 3) dataStr = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        
        const card = document.createElement('div');
        card.className = 'historico-card';
        card.innerHTML = `
            <div class="card-header">
                <span class="data-servico">${dataStr} - ${reg.tipoServico}</span>
                <div class="acoes-card">
                    <button class="btn-editar" onclick="editarRegistro('${reg.id}')">✎ Editar</button>
                    <button class="btn-excluir" onclick="excluirRegistro('${reg.id}')">🗑 Excluir</button>
                </div>
            </div>
            <div class="card-body">
                <p><strong>Profissional:</strong> ${reg.profissional}</p>
                <p><strong>Marca/Tinta:</strong> ${reg.marcaTinta || 'N/A'}</p>
                <p><strong>Fórmula:</strong> ${reg.formula || 'N/A'}</p>
                <p><strong>Pausa:</strong> ${reg.tempoPausa ? reg.tempoPausa + ' min' : 'N/A'}</p>
                <p><strong>Corte:</strong> ${reg.corte || 'N/A'}</p>
                <p><strong>Recomendação:</strong> ${reg.recomendacao || 'N/A'}</p>
                ${reg.observacoes ? `<div class="observacao-box"><strong>Diagnóstico/Obs:</strong> ${reg.observacoes}</div>` : ''}
            </div>
        `;
        listaHistorico.appendChild(card);
    });
}

// ==========================================
// FUNÇÕES DO MODAL (ADD / EDITAR)
// ==========================================
function abrirModal(ehEdicao = false) {
    modalRegistro.style.display = 'flex';
    if(!ehEdicao) {
        document.getElementById('editandoId').value = "";
        formHistorico.reset();
        document.getElementById('modalTitle').innerText = "Novo Registro de Atendimento";
        // Preenche com a data atual
        const hoje = new Date().toISOString().split('T')[0];
        document.getElementById('dataAtendimento').value = hoje;
    }
}

function fecharModal() {
    modalRegistro.style.display = 'none';
}

btnNovoRegistro.addEventListener('click', () => abrirModal(false));
closeBtn.addEventListener('click', fecharModal);
btnCancelarRegistro.addEventListener('click', fecharModal);

// Salvar/Editar formulário
formHistorico.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!clienteAtual) return;

    const idEditando = document.getElementById('editandoId').value;
    
    // Ler valores
    const novoRegistro = {
        id: idEditando !== "" ? idEditando : "reg-" + Date.now(),
        codCliente: clienteAtual,
        data: document.getElementById('dataAtendimento').value,
        profissional: document.getElementById('profissional').value,
        tipoServico: document.getElementById('tipoServico').value,
        produtos: document.getElementById('produtosUtilizados').value,
        marcaTinta: document.getElementById('marcaTinta').value,
        formula: document.getElementById('formulaColoracao').value,
        tempoPausa: document.getElementById('tempoPausa').value,
        corte: document.getElementById('corteRealizado').value,
        preferencias: document.getElementById('preferencias').value,
        observacoes: document.getElementById('observacoes').value,
        recomendacao: document.getElementById('proximaRecomendacao').value
    };

    if (idEditando !== "") {
        // Editando
        const index = historicoMock.findIndex(r => r.id === idEditando);
        if (index > -1) historicoMock[index] = novoRegistro;
        alert("Registro alterado com sucesso!");
    } else {
        // Novo
        historicoMock.push(novoRegistro);
        alert("Registro adicionado com sucesso!");
    }

    fecharModal();
    renderizarCards(clienteAtual);
});

// Acessível globalmente via onClick no HTML
window.editarRegistro = function(idGeral) {
    const reg = historicoMock.find(r => r.id === idGeral);
    if(reg) {
        document.getElementById('editandoId').value = reg.id;
        document.getElementById('dataAtendimento').value = reg.data;
        document.getElementById('profissional').value = reg.profissional;
        document.getElementById('tipoServico').value = reg.tipoServico;
        document.getElementById('produtosUtilizados').value = reg.produtos;
        document.getElementById('marcaTinta').value = reg.marcaTinta;
        document.getElementById('formulaColoracao').value = reg.formula;
        document.getElementById('tempoPausa').value = reg.tempoPausa;
        document.getElementById('corteRealizado').value = reg.corte;
        document.getElementById('preferencias').value = reg.preferencias;
        document.getElementById('observacoes').value = reg.observacoes;
        document.getElementById('proximaRecomendacao').value = reg.recomendacao;
        
        document.getElementById('modalTitle').innerText = "Editar Registro de Atendimento";
        abrirModal(true);
    }
}

window.excluirRegistro = function(idGeral) {
    if(confirm("Tem certeza que deseja excluir esse registro do histórico?")) {
        historicoMock = historicoMock.filter(r => r.id !== idGeral);
        renderizarCards(clienteAtual);
    }
}
